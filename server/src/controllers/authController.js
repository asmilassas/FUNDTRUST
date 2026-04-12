const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");

// JWT with expiration. The payload includes role so the frontend
const createToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prevent duplicate accounts
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate a random 6-digit OTP valid for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({ name, email, password, otp, otpExpires, isVerified: false });
    await user.save();

    // Send the OTP to the user's email address
    try {
      console.log("Sending OTP to:", email, "| OTP:", otp);
      await sendEmail(
      email,
      "Verify Your FundTrust Account",
      `Hi ${name},\n\nYour OTP code is: ${otp}\n\nThis code expires in 10 minutes.\n\nFundTrust Team`
    );
  } catch (emailErr) {
  await User.deleteOne({ email });
  console.error("❌ OTP email failed:", emailErr.message);
  return res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
    return res.status(201).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// POST /auth/verify-otp 
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    // Check expiry before checking value 
    if (user.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // Mark as verified 
    user.isVerified  = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: "Account verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};

// POST /auth/login 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Block unverified users from logging in
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before logging in" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      token: createToken(user),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Unable to login" });
  }
};

module.exports = { register, login, verifyOtp };