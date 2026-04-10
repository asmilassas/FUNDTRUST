const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const {
  upsertFeedback,
  getCharityFeedback,
  deleteFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

// GET /api/feedback/charity/:charityId — public
router.get("/charity/:charityId", getCharityFeedback);

// GET /api/feedback/all — public
router.get("/all", getAllFeedback);

// GET /api/feedback/admin/all — admin only
router.get("/admin/all", protect, admin, getAllFeedback);

// POST /api/feedback/charity/:charityId — create/update review
router.post("/charity/:charityId", protect, upsertFeedback);

// DELETE /api/feedback/:id — user deletes own feedback
router.delete("/:id", protect, deleteFeedback);

module.exports = router;