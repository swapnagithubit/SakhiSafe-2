const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sosRoutes = require("./routes/sosRoutes");
const crimeRoutes = require("./routes/crimeRoutes");
const crimeRiskRoutes = require("./routes/crimeRiskRoutes");
const alertRoutes = require("./routes/alertRoutes");

const { loadCSV } = require("./utils/csvLoader");

const app = express();

// 🚨 Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) =>
  res.json({ message: "Sakhi Backend is Running ✅" })
);

// 🔥 MongoDB Connection
const MONGO_URI =
  "mongodb://moulkarswapna_db_user:nK4sTsL3fQR2m69H@ac-s4g4fk6-shard-00-00.hs0awm4.mongodb.net:27017,ac-s4g4fk6-shard-00-01.hs0awm4.mongodb.net:27017,ac-s4g4fk6-shard-00-02.hs0awm4.mongodb.net:27017/sakhiDB?ssl=true&replicaSet=atlas-69lpdd-shard-0&authSource=admin&retryWrites=true&w=majority&appName=SafeSakhi";

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("DB Connected ✅"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api", crimeRoutes);
app.use("/api", crimeRiskRoutes);
app.use("/api/alerts", alertRoutes);

// 🚨 Emergency SMS Alert Route
app.post("/send-alert", async (req, res) => {
  try {
    const { contacts, message } = req.body;

    if (!contacts || !message) {
      return res.status(400).json({
        success: false,
        error: "Contacts and message are required",
      });
    }

    for (const number of contacts) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
      });
    }

    res.json({
      success: true,
      message: "Emergency alerts sent successfully ✅",
    });
  } catch (error) {
    console.log("❌ Twilio Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 🔥 Load CSV
loadCSV()
  .then(() => console.log("CSV Loaded"))
  .catch((err) => console.log("CSV Error:", err));

// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);