const router = require("express").Router();
const { addContact, getContacts } = require("../controllers/contactController");
const auth = require("../middleware/authMiddleware");

router.post("/add", auth, addContact);
router.get("/", auth, getContacts);

module.exports = router;