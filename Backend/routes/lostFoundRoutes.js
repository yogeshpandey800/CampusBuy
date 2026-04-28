const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const LostFound = require("../models/LostFound");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all lost & found posts
router.get("/all", async (req, res) => {
  try {
    const posts = await LostFound.find()
      .populate("user", "name email profileImage whatsapp branch")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lost & found posts" });
  }
});

// POST create a lost or found post
router.post("/create", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { type, title, description, location, contact } = req.body;

    if (!type || !title || !description) {
      return res.status(400).json({ error: "type, title, and description are required" });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({ error: "type must be 'lost' or 'found'" });
    }

    let imageUrl = "";
    if (req.file) {
      const base64 = Buffer.from(req.file.buffer).toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: "buyandsell_lostfound" });
      imageUrl = result.secure_url;
    }

    const post = await LostFound.create({
      type,
      title,
      description,
      location: location || "",
      contact: contact || "",
      image: imageUrl,
      user: req.user._id,
    });

    const populated = await post.populate("user", "name email profileImage whatsapp branch");
    res.status(201).json({ message: "Post created successfully", post: populated });
  } catch (error) {
    console.error("Lost & Found create error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PATCH mark as resolved (owner only)
router.patch("/:id/resolve", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await LostFound.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    post.resolved = true;
    await post.save();
    res.json({ message: "Marked as resolved", post });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE a post (owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await LostFound.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
