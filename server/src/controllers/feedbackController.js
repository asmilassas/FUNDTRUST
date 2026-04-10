const Feedback = require("../models/Feedback");
const Charity = require("../models/Charity");

// POST /feedback/charity/:charityId 
const upsertFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const charityId = req.params.charityId;

    if (!rating || !comment) return res.status(400).json({ message: "Rating and comment are required" });

    // Make sure the charity actually exists
    const charity = await Charity.findById(charityId);
    if (!charity) return res.status(404).json({ message: "Charity not found" });

    // Check if this user has already reviewed this charity
    const existing = await Feedback.findOne({ user: req.user._id, charity: charityId });

    if (existing) {
      // Update the existing review
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: "Feedback updated", feedback: existing });
    }

    // Create a new review
    const feedback = new Feedback({ user: req.user._id, charity: charityId, rating, comment });
    await feedback.save();

    // Populate the user name for the response
    const populated = await Feedback.findById(feedback._id).populate("user", "name");
    return res.status(201).json({ message: "Feedback submitted", feedback: populated });
  } catch (err) {
    // Handle the unique-index constraint 
    if (err.code === 11000) return res.status(400).json({ message: "You have already reviewed this fund" });
    console.error("Feedback error:", err);
    return res.status(500).json({ message: "Failed to submit feedback" });
  }
};

// GET /feedback/charity/:charityId — public
const getCharityFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ charity: req.params.charityId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    return res.json({ feedback });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// DELETE /feedback/:id — owner
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await feedback.deleteOne();
    return res.json({ message: "Feedback deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

// GET /feedback/admin/all — admin only
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .populate("charity", "name")
      .sort({ createdAt: -1 });
    return res.json({ feedback });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

module.exports = { upsertFeedback, getCharityFeedback, deleteFeedback, getAllFeedback };