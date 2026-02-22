const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, admin } = require("../middlewares/authMiddleware");

// =======================
// Public
// =======================

router.get("/", getCategories);

// =======================
// Admin Only
// =======================

router.post("/", protect, admin, createCategory);
router.patch("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;