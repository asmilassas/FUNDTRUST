require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors       = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const charityRoutes = require("./routes/charityRoutes");
const donationRoutes = require("./routes/donationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Serve uploaded images 
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/feedback", feedbackRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Connect to MongoDB then start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`FundTrust server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = app; 