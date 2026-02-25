const Feedback = require("../models/Feedback");
const Charity = require("../models/Charity");

//Create Feedback
const createFeedback = async (req, res) => {
  try {
    const { charityId, rating, comment } = req.body;

    // Validation
    if (!charityId || !rating || !comment) {
      return res.status(400).json({
        message: "charityId, rating and comment are required",
      });
    }

    // Check if charity exists
    const charity = await Charity.findById(charityId);

    if (!charity) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    const feedback = new Feedback({
      user: req.user._id,
      charity: charityId,
      rating,
      comment,
    });

    await feedback.save();

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

//Get Logged User Feedback
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      user: req.user._id,
    }).populate("charity", "name");

    res.json({ feedback });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
};

//Admin — Get All Feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .populate("charity", "name")
      .sort({ createdAt: -1 });

    res.json({ feedback });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
};

//Update Feedback (Owner Only)
const updateFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    // Ownership check
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (rating) feedback.rating = rating;
    if (comment) feedback.comment = comment;

    await feedback.save();

    res.json({
      message: "Feedback updated",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
    });
  }
};

//Delete Feedback
//User can delete own
//Admin can delete any
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    if (
      feedback.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await feedback.deleteOne();

    res.json({
      message: "Feedback deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
};