const express = require("express");
const {
  register,
  login,
  verifyOtp,
} = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;