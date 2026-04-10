const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// One feedback per user per charity
feedbackSchema.index({ user: 1, charity: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);