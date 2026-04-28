const express = require("express");
const router = express.Router();
const { sendFeedback, getAllFeedback } = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

router.post("/send", sendFeedback);
router.get("/all", authMiddleware, isAdmin, getAllFeedback);

module.exports = router;
