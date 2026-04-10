const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  createUserByAdmin,
  toggleAdmin,
} = require("../controllers/userController");

const router = express.Router();

// GET logged-in user profile
router.get("/profile", protect, getProfile);
router.get("/me", protect, getProfile);

// Update profile (name/password)
router.patch("/me", protect, updateProfile);

// Get all users (admin only)
router.get("/admin/all", protect, admin, getAllUsers);

// Delete user (admin only)
router.delete("/admin/:id", protect, admin, deleteUser);

// Create user (admin only)
router.post("/admin/create", protect, admin, createUserByAdmin);

// Toggle admin role (admin only)
router.patch("/admin/:id/toggle-admin", protect, admin, toggleAdmin);

module.exports = router;