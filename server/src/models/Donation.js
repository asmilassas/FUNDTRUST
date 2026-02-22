const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  charity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },

  paymentMethod: {
    type: String,
    enum: ["stripe", "bank"],
    default: "stripe",
  },

  receiptImage: { type: String },

  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'one-time',
  },

  status: {
  type: String,
  enum: ["pending", "succeeded", "failed", "rejected"],
  default: "pending",
},

  rejectionReason: {
  type: String,
},

  stripePaymentIntentId: { type: String },
  stripeSubscriptionId: { type: String },
  receiptUrl: { type: String },
  impactNote: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
},
{ timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
