const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

// Controllers
const {
  createDonation,
  confirmDonation,
  listUserDonations,
  listTransparencySummary,
  getPlatformStats,
  getDonationReceipt,
  getCharityDonations,
} = require("../controllers/donationController");

const router = express.Router();

// Platform stats (home page)
router.get("/stats", getPlatformStats);

// Transparency breakdown (public leaderboard)
router.get("/transparency", listTransparencySummary);

// All donations for a specific charity (public view)
router.get("/charity/:charityId", getCharityDonations);

// Create donation and Stripe PaymentIntent
router.post("/", protect, createDonation);

// Confirm Stripe payment
router.post("/:id/confirm", protect, confirmDonation);

// Logged-in user's donations
router.get("/me", protect, listUserDonations);

// Single receipt (owner only)
router.get("/:id/receipt", protect, getDonationReceipt);

module.exports = router;