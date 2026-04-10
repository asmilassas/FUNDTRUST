const mongoose = require("mongoose");
const Charity  = require("../models/Charity");
const Donation = require("../models/Donation");
const User     = require("../models/User");
const sendEmail = require("../utils/emailService");

// Load Stripe only if the key is configured 
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

const getCharity = async (charityId) => {
  if (!mongoose.Types.ObjectId.isValid(charityId)) throw new Error("Invalid charity id");
  const charity = await Charity.findById(charityId);
  if (!charity) throw new Error("Charity not found");
  return charity;
};

// POST /donations
// Creates a Stripe PaymentIntent and records the donation.
const createDonation = async (req, res) => {
  try {
    // Admins are not allowed to donate
    if (req.user.isAdmin) return res.status(403).json({ message: "Admins cannot donate" });
    if (!stripe) return res.status(500).json({ message: "Payment provider not configured" });

    const { charityId, amount, message = "", anonymous = false } = req.body;

    if (!charityId || !amount) return res.status(400).json({ message: "charityId and amount are required" });
    if (Number(amount) < 1) return res.status(400).json({ message: "Minimum donation is LKR 1" });

    const charity = await getCharity(charityId);

    // Enforce funding cap so a fund cannot be over-funded
    const goal = charity.goals?.[0];
    if (goal) {
      const remaining = goal.targetAmount - goal.amountRaised;
      if (remaining <= 0) return res.status(400).json({ message: "This fund is fully funded" });
      if (Number(amount) > remaining) return res.status(400).json({ message: `Maximum donation is LKR ${remaining.toLocaleString()}` });
    }

    // Create a Stripe PaymentIntent 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "usd", // Stripe requires a valid currency code, amount is displayed as LKR in the UI
      description: `Donation to ${charity.name}`,
      metadata: { charityId: charity._id.toString(), userId: req.user._id.toString() },
    });

    // Record the donation in DB with status pending until payment is confirmed
    const donation = new Donation({
      user: req.user._id,
      charity: charity._id,
      amount: Number(amount),
      status: "pending",
      stripePaymentIntentId: paymentIntent.id,
      message: message.trim(),
      anonymous,
    });
    await donation.save();

    // Return the clientSecret so the frontend can confirm the payment with Stripe.js
    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      donationId: donation._id,
    });
  } catch (err) {
    console.error("createDonation error:", err);
    return res.status(500).json({ message: err.message || "Donation failed" });
  }
};

// POST /donations/:id/confirm
// Called after Stripe payment is confirmed on the client side.
const confirmDonation = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const donation = await Donation.findById(req.params.id).populate("charity", "name goals");
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    // Verify payment status with Stripe
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") return res.status(400).json({ message: "Payment not yet confirmed" });

    // Mark donation as succeeded
    donation.status = "succeeded";
    donation.cardLast4 = pi.payment_method ? (await stripe.paymentMethods.retrieve(pi.payment_method))?.card?.last4 : null;
    await donation.save();

    // Update the charity's raised amount and donor count
    const charity = await Charity.findById(donation.charity._id);
    if (charity?.goals?.[0]) charity.goals[0].amountRaised += donation.amount;
    const alreadyDonated = await Donation.exists({ charity: donation.charity._id, user: req.user._id, status: "succeeded", _id: { $ne: donation._id } });
    if (!alreadyDonated) charity.donorCount = (charity.donorCount || 0) + 1;
    await charity.save();

    // Send a confirmation email (non-blocking)
    sendEmail(req.user.email, `Donation Confirmed – ${charity.name}`,
      `Hi ${req.user.name},\n\nThank you for your LKR ${donation.amount.toLocaleString()} donation to "${charity.name}"!\n\nFundTrust Team`
    ).catch(e => console.warn("Email failed:", e.message));

    const populated = await Donation.findById(donation._id).populate("charity", "name mission");
    return res.json({ message: "Donation confirmed", donation: populated });
  } catch (err) {
    console.error("confirmDonation error:", err);
    return res.status(500).json({ message: err.message || "Confirmation failed" });
  }
};

// GET /donations/me — list the user's successful donations 
const listUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id, status: "succeeded" })
      .populate("charity", "name mission coverImage")
      .sort({ createdAt: -1 });
    return res.json({ donations });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch donations" });
  }
};

// GET /donations/transparency — public breakdown per charity 
const listTransparencySummary = async (req, res) => {
  try {
    const summary = await Donation.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: "$charity", totalAmount: { $sum: "$amount" }, donationCount: { $sum: 1 }, uniqueDonors: { $addToSet: "$user" } } },
      { $lookup: { from: "charities", localField: "_id", foreignField: "_id", as: "charity" } },
      { $unwind: "$charity" },
      { $project: { _id: 0, charityId: "$charity._id", charityName: "$charity.name", mission: "$charity.mission", coverImage: "$charity.coverImage", totalAmount: 1, donationCount: 1, donorCount: { $size: "$uniqueDonors" }, goals: "$charity.goals", transparencyUpdates: "$charity.transparencyUpdates" } },
      { $sort: { totalAmount: -1 } },
    ]);
    return res.json({ summary });
  } catch (err) {
    return res.status(500).json({ message: "Unable to build transparency summary" });
  }
};

// GET /donations/stats — numbers from all charities for the home page hero 
const getPlatformStats = async (req, res) => {
  try {
    const [agg] = await Donation.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, totalRaised: { $sum: "$amount" }, totalDonations: { $sum: 1 }, uniqueDonors: { $addToSet: "$user" } } },
    ]);
    const totalFunds = await Charity.countDocuments();
    return res.json({
      totalRaised: agg?.totalRaised || 0,
      totalDonors: agg?.uniqueDonors?.length || 0,
      totalDonations: agg?.totalDonations || 0,
      totalFunds,
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch stats" });
  }
};

// GET /donations/:id/receipt — fetch a single donation receipt (user only)
const getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("charity", "name mission")
      .populate("user", "name email");
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    return res.json({ donation });
  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch receipt" });
  }
};

// GET /donations/charity/:charityId
// Returns all successful donations for a specific fund.
const getCharityDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      charity: req.params.charityId,
      status: "succeeded",
    })
      .populate("user", "name")  // only fetch name
      .sort({ createdAt: -1 });

    // Hide donor name for anonymous donations
    const sanitised = donations.map(d => ({
      _id: d._id,
      amount: d.amount,
      createdAt: d.createdAt,
      donor: d.anonymous ? "Anonymous" : (d.user?.name || "Anonymous"),
    }));

    return res.json({ donations: sanitised });
  } catch (err) {
    console.error("getCharityDonations error:", err);
    return res.status(500).json({ message: "Unable to fetch donations" });
  }
};

module.exports = { createDonation, confirmDonation, listUserDonations, listTransparencySummary, getPlatformStats, getDonationReceipt, getCharityDonations };