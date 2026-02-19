const express = require("express");
const router = express.Router();

const {
  createOneTimeDonation,
  createRecurringDonation,
  listUserDonations,
  listTransparencySummary,
  acknowledgeDonation,
  approveDonation,
  getPendingDonations
} = require("../controllers/donationController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// =======================
// Public Routes
// =======================

router.get("/transparency", listTransparencySummary);

// =======================
// User Protected Routes
// =======================

router.post(
  "/one-time",
  protect,
  upload.single("receiptImage"),
  createOneTimeDonation
);

router.post("/recurring", protect, createRecurringDonation);

router.get("/me", protect, listUserDonations);

router.get("/:id/receipt", protect, acknowledgeDonation);

// =======================
// Admin Only Routes
// =======================

router.get(
  "/admin/pending",
  protect,
  adminOnly,
  getPendingDonations
);

router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveDonation
);

module.exports = router;
