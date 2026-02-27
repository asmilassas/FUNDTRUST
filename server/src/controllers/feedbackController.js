const Feedback = require("../models/Feedback");
const sendEmail = require("../utils/emailService");

// Create feedback (Logged user only)
const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const feedback = new Feedback({
      user: req.user._id,
      rating,
      comment,
    });

    await feedback.save();

    // ✅ Send Thank You Email
    await sendEmail(
      req.user.email,
      "Thank You for Your Feedback - FundTrust",
      `Hi ${req.user.name},

Thank you for submitting your feedback to FundTrust.

We truly appreciate your support and contribution.

Best regards,
FundTrust Team`
    );

    res.status(201).json({
      message: "Feedback created successfully",
      feedback,
    });

  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({
      message: "Failed to create feedback",
    });
  }
};

// Get all feedback (Public)
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "_id name email")
      .sort({ createdAt: -1 });

    res.json({ feedback });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// Update feedback (Owner only)
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    feedback.rating = req.body.rating;
    feedback.comment = req.body.comment;

    await feedback.save();

    res.json({ message: "Updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete feedback (Owner only)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await feedback.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
};