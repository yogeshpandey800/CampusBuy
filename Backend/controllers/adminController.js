const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
    ]);

    return res.json({ totalUsers, totalProducts });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "Admin cannot delete own account" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Product.deleteMany({ user: id });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

// Bonus: admin can remove any product.
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};
