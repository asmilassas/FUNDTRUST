const Comment = require("../models/Comment");

const createComment = async (req, res) => {
  try {
    const { rating, message } = req.body;

    if (!rating || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const comment = await Comment.create({
      user: req.user._id,
      rating,
      message,
    });

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment" });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

module.exports = {
  createComment,
  getComments,
};