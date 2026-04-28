const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  deleteUser,
  deleteProduct,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/products", getAllProducts);
router.delete("/users/:id", deleteUser);
router.delete("/products/:id", deleteProduct);

module.exports = router;
