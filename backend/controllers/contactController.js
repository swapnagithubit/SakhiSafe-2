const Contact = require("../models/Contact");

const addContact = async (req, res) => {
  try {
    let { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    // Strip spaces, dashes, brackets
    phone = phone.replace(/[\s\-().]/g, "");

    // Add +91 if not already in E.164 format
    if (!phone.startsWith("+")) {
      phone = "+91" + phone.replace(/^0/, ""); // remove leading 0 if any
    }

    // Basic validation — must be +91 followed by 10 digits
    if (!/^\+91\d{10}$/.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number. Enter a valid 10-digit Indian mobile number.",
      });
    }

    // Prevent duplicate contacts for same user
    const existing = await Contact.findOne({ userId: req.user.id, phone });
    if (existing) {
      return res.status(400).json({ error: "This number is already saved." });
    }

    const contact = await Contact.create({
      userId: req.user.id,
      name,
      phone,
    });

    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addContact, getContacts };
