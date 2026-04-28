const express = require("express");
const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/wishlist/add
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const existing = await Wishlist.findOne({
      userId: req.user._id,
      productId,
    });

    if (existing) {
      return res.status(200).json({
        message: "Already in wishlist",
        wishlistItem: existing,
      });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user._id,
      productId,
    });

    return res.status(201).json({
      message: "Added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({ message: "Already in wishlist" });
    }
    return res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/remove/:productId
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    await Wishlist.deleteOne({
      userId: req.user._id,
      productId,
    });

    return res.json({ message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

// GET /api/wishlist/:userId
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const wishlist = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        populate: {
          path: "user",
          select: "name email profileImage branch whatsapp",
        },
      })
      .sort({ createdAt: -1 });

    return res.json({
      items: wishlist,
      productIds: wishlist
        .map((item) => item.productId?._id?.toString())
        .filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

module.exports = router;
