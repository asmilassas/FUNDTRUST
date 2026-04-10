const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// GET /api/categories — public
router.get("/", getCategories);

// POST /api/categories — admin only
router.post("/", protect, admin, createCategory);

// PATCH /api/categories/:id — admin only
router.patch("/:id", protect, admin, updateCategory);

// DELETE /api/categories/:id — admin only
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;