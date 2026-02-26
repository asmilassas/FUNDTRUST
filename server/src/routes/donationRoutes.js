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
  getPendingDonations
} = require("../controllers/donationController");

const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// Public
router.get("/transparency", listTransparencySummary);

// User
router.post(
  "/one-time",
  protect,
  upload.single("receiptImage"),
  createOneTimeDonation
);

router.post("/recurring", protect, createRecurringDonation);
router.get("/me", protect, listUserDonations);
router.get("/:id/receipt", protect, acknowledgeDonation);

// Admin
router.get("/admin/pending", protect, admin, getPendingDonations);
router.put("/:id/approve", protect, admin, approveDonation);
router.put("/:id/reject", protect, adminOnly, rejectDonation);
module.exports = router;