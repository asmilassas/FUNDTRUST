const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // User who created feedback
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Charity being reviewed
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },

    // Rating 1–5
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Text comment
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);