const { execFile } = require("child_process");
const path = require("path");

const { getData } = require("../utils/csvLoader");

const PYTHON = process.env.PYTHON_BIN || "python";
const PREDICT_SCRIPT = path.join(__dirname, "../ml/predict.py");
const CACHE_TTL_MS = 60 * 1000;

let allPredictionsCache = null;
let allPredictionsCachedAt = 0;

function runPrediction(args) {
  return new Promise((resolve, reject) => {
    execFile(
      PYTHON,
      [PREDICT_SCRIPT, ...args],
      {
        // Importing pandas/scikit-learn can take longer than a normal API
        // request on a cold Windows process; cache the all-city response below.
        timeout: 120_000,
        maxBuffer: 2 * 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          const details = stderr.trim() || error.message;
          reject(new Error(`Crime-risk model failed: ${details}`));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch {
          reject(new Error("Crime-risk model returned invalid JSON"));
        }
      }
    );
  });
}

async function getAllPredictions() {
  if (
    allPredictionsCache &&
    Date.now() - allPredictionsCachedAt < CACHE_TTL_MS
  ) {
    return allPredictionsCache;
  }

  const result = await runPrediction(["--all"]);
  allPredictionsCache = result;
  allPredictionsCachedAt = Date.now();
  return result;
}

function findCity(cityName) {
  const requested = String(cityName || "").trim().toLowerCase();
  return getData().find(
    (row) => String(row.City).trim().toLowerCase() === requested
  );
}

function handleModelError(res, error) {
  console.error(error.message);
  return res.status(503).json({
    message: "Crime-risk predictions are temporarily unavailable",
  });
}

async function getCrimeRisk(req, res) {
  try {
    const result = await getAllPredictions();
    const predictionsByCity = new Map(
      result.predictions.map((prediction) => [
        prediction.city.toLowerCase(),
        prediction,
      ])
    );
    const data = getData().map((row) => {
      const prediction = predictionsByCity.get(row.City.toLowerCase());
      return {
        ...row,
        predictedSafetyZone: prediction?.prediction || null,
        predictionProbabilities: prediction?.probabilities || {},
      };
    });

    res.json({
      target: result.model.target,
      model: result.model.model,
      metrics: result.model.metrics,
      data,
    });
  } catch (error) {
    handleModelError(res, error);
  }
}

async function predictCrimeRisk(req, res) {
  const featureValues = req.body?.features;
  const cityName = req.params.city || req.body?.city || req.query.city;

  if (featureValues !== undefined) {
    if (
      !featureValues ||
      Array.isArray(featureValues) ||
      typeof featureValues !== "object"
    ) {
      return res.status(400).json({
        message: "features must be a JSON object",
      });
    }

    try {
      const result = await runPrediction([
        "--features",
        JSON.stringify(featureValues),
      ]);
      return res.json({
        predictedSafetyZone: result.prediction,
        predictionProbabilities: result.probabilities,
        target: result.model.target,
        model: result.model.model,
      });
    } catch (error) {
      return handleModelError(res, error);
    }
  }

  const city = findCity(cityName);
  if (!city) {
    return res.status(404).json({ message: "City not found" });
  }

  try {
    const result = await runPrediction(["--city", city.City]);
    res.json({
      ...city,
      predictedSafetyZone: result.prediction,
      predictionProbabilities: result.probabilities,
      target: result.model.target,
      model: result.model.model,
    });
  } catch (error) {
    handleModelError(res, error);
  }
}

module.exports = { getCrimeRisk, predictCrimeRisk };
