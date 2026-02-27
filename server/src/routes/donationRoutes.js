const express = require("express");
const router = express.Router();

const {
  createOneTimeDonation,
  createRecurringDonation,
  listUserDonations,
  listTransparencySummary,
  acknowledgeDonation,
  approveDonation,
  rejectDonation,
  getPendingDonations,
} = require("../controllers/donationController");

const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


// ======================================
// PUBLIC ROUTES
// ======================================

// Transparency summary
router.get("/transparency", listTransparencySummary);


// ======================================
// USER ROUTES (Protected)
// ======================================

// One-time donation (supports bank receipt upload)
router.post(
  "/one-time",
  protect,
  upload.single("receiptImage"),
  createOneTimeDonation
);

// Recurring donation
router.post("/recurring", protect, createRecurringDonation);

// Get logged-in user's donations
router.get("/me", protect, listUserDonations);

// View donation receipt
router.get("/:id/receipt", protect, acknowledgeDonation);


// ======================================
// ADMIN ROUTES
// ======================================

// Get all pending bank donations
router.get(
  "/admin/pending",
  protect,
  admin,
  getPendingDonations
);

// Approve donation
router.put(
  "/:id/approve",
  protect,
  admin,
  approveDonation
);

// Reject donation
router.put(
  "/:id/reject",
  protect,
  admin,
  rejectDonation
);


module.exports = router;