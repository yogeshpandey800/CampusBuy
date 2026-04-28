const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  email: { type: String, default: "" },
  rating: { type: Number, min: 1, max: 5 },
  like: { type: String, default: "" },
  improve: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
