const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🚨 Send Danger Alert
router.post("/send-alert", async (req, res) => {
  try {
    const { contacts, location, zone } = req.body;

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No trusted contacts provided",
      });
    }

    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lon}`;

    const messageBody =
      `🚨 SAKHI EMERGENCY ALERT 🚨\n\n` +
      `User entered a ${zone} danger zone.\n\n` +
      `📍 Live Location:\n${googleMapsLink}\n\n` +
      `Please contact them immediately.`;

    const results = [];

    for (const phone of contacts) {
      try {
        const message = await client.messages.create({
          body: messageBody,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });

        results.push({
          phone,
          success: true,
          sid: message.sid,
        });
      } catch (err) {
        results.push({
          phone,
          success: false,
          error: err.message,
        });
      }
    }

    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;