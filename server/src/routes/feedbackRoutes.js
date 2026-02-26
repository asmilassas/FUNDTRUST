const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const { protect } = require("../middlewares/authMiddleware");

// Public
router.get("/", getAllFeedback);

// Logged users only
router.post("/", protect, createFeedback);
router.put("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;