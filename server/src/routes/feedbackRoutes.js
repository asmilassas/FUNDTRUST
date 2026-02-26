const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const { protect } = require("../middlewares/authMiddleware");
const adminOnly  = require("../middlewares/adminMiddleware");

//User Routes
router.post("/", protect, createFeedback);
router.get("/me", protect, getMyFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

//Admin Routes
router.get("/", protect, adminOnly, getAllFeedback);

module.exports = router;