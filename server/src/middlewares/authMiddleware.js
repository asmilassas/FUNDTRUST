const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// protect — must be used on any route that requires a logged-in user
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Reject requests with no token 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Load the full user object
    const user = await User.findById(payload.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Blocks access if the logged-in user is not an admin
const admin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, admin };