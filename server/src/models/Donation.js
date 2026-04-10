const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    charity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd"}, // Stripe currency code; UI displays LKR
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "card" },
    cardLast4: { type: String },
    stripePaymentIntentId: { type: String },
    receiptUrl: { type: String },
    message: { type: String },
    anonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);