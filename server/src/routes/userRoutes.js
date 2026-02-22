const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updatePreferences,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { protect, admin } = require("../middlewares/authMiddleware");

/* ===============================
   USER ROUTES (Protected)
================================= */

// Get logged-in user profile
router.get("/me", protect, getProfile);

// Update profile
router.patch("/me", protect, updateProfile);

// Update preferences
router.patch("/preferences", protect, updatePreferences);

// Get notifications
router.get("/notifications", protect, async (req, res) => {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user._id)
      .select("notifications");

    res.json({ notifications: user.notifications || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

/* ===============================
   ADMIN ROUTES
================================= */

// Get all users
router.get("/admin/all", protect, admin, getAllUsers);

// Delete user
router.delete("/admin/:id", protect, admin, deleteUser);

module.exports = router;