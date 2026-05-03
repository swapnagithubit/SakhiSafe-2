const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

let crimeData = [];

// Load CSV Data
const loadCSV = () => {
  return new Promise((resolve, reject) => {
    // 🔥 Reset data to avoid duplicates
    crimeData = [];

    // ✅ Correct file path (works in all cases)
    const filePath = path.join(__dirname, "../data/city_safety_scores.csv");

    // ⚠️ Check if file exists
    if (!fs.existsSync(filePath)) {
      return reject("CSV file not found at: " + filePath);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // 🔍 Debug (optional)
        // console.log(row);

        crimeData.push(row);
      })
      .on("end", () => {
        console.log("CSV Loaded Successfully ✅");
        console.log("Total Records:", crimeData.length);

        resolve(crimeData);
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        reject(error);
      });
  });
};

// Get Loaded Data
const getData = () => {
  return crimeData;
};

module.exports = { loadCSV, getData };