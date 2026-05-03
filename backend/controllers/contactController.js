const Contact = require("../models/Contact");

const addContact = async (req, res) => {
  const contact = await Contact.create({
    userId: req.user.id,
    name: req.body.name,
    phone: req.body.phone
  });
  res.json(contact);
};

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id });
  res.json(contacts);
};

module.exports = { addContact, getContacts };