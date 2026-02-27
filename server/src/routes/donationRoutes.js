const express = require("express");
const router = express.Router();

const {
  createOneTimeDonation,
  createRecurringDonation,
  listUserDonations,
  listTransparencySummary,
  acknowledgeDonation,
} = require("../controllers/donationController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public
router.get("/transparency", listTransparencySummary);

// User
router.post("/one-time", protect, createOneTimeDonation);
router.post("/recurring", protect, createRecurringDonation);
router.get("/me", protect, listUserDonations);
router.get("/:id/receipt", protect, acknowledgeDonation);

module.exports = router;