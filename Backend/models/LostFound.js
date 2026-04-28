const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ["lost", "found"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "" },
  contact: { type: String, default: "" },
  image: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LostFound", lostFoundSchema);
