const router = require("express").Router();
const {
  getCrimeRisk,
  predictCrimeRisk,
} = require("../controllers/crimeRiskController");

router.get("/crime-risk", getCrimeRisk);
router.get("/crime-risk/:city", predictCrimeRisk);
router.post("/crime-risk/predict", predictCrimeRisk);

module.exports = router;
