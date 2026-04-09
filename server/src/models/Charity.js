const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    amountRaised: { type: Number, default: 0 },
    deadline: { type: Date },
  },
  { _id: false }
);

const transparencyUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],   // multiple images
    status: {
      type: String,
      enum: ["started", "in-progress", "completed"],
      default: "started"
    },
    publishedAt: { type: Date, default: Date.now },
  }
);

const charitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mission: { type: String, required: true },
    impact: { type: String },
    focusAreas: [{ type: String }],
    category: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         required: true
    },

    donationNeeds: {
      summary: { type: String },
      items: [
        {
          label: { type: String, required: true },
          description: { type: String },
          amountNeeded: { type: Number, required: true },
        },
      ],
    },
    goals: [goalSchema],
    coverImage: { type: String },
    transparencyUpdates: [transparencyUpdateSchema],
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Charity', charitySchema);