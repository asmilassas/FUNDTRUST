const mongoose = require('mongoose');
const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const { generateReceipt } = require('../utils/receipt');

let stripeClient = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = require('stripe');
    stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.warn('Stripe SDK is not available.', error.message);
}

const stripeReady = Boolean(stripeClient);

const ensureCharityExists = async (charityId) => {
  if (!mongoose.Types.ObjectId.isValid(charityId)) {
    throw new Error('Invalid charity id');
  }

  const charity = await Charity.findById(charityId);
  if (!charity) throw new Error('Charity not found');
  return charity;
};

// Create donation record locally
const createDonationRecord = async ({ user, charity, payload }) => {
  const donation = new Donation({
    user: user._id,
    charity: charity._id,
    amount: payload.amount,
    currency: payload.currency || 'usd',
    frequency: payload.frequency,
    impactNote: payload.impactNote,
    metadata: payload.metadata,
    status: 'pending',
    paymentMethod: 'stripe',
  });

  // Update charity goal
  const goal = charity.goals?.[0];
  if (goal) {
    goal.amountRaised += donation.amount;
    await charity.save();
  }

  await donation.save();
  return donation;
};

// --- One-Time Donation ---
const createOneTimeDonation = async (req, res) => {
  try {
    if (!stripeReady) return res.status(500).json({ message: "Stripe not configured" });
    if (req.user.isAdmin) return res.status(403).json({ message: "Admins cannot donate" });

    const { charityId, amount, currency = "usd", metadata = {}, impactNote } = req.body;
    if (!charityId || !amount) return res.status(400).json({ message: "charityId and amount required" });

    const charity = await ensureCharityExists(charityId);

    // Prevent overfunding
    const goal = charity.goals?.[0];
    if (goal) {
      const remaining = goal.targetAmount - goal.amountRaised;
      if (remaining <= 0) return res.status(400).json({ message: "Project fully funded" });
      if (Number(amount) > remaining) return res.status(400).json({ message: `Only $${remaining} remaining` });
    }

    // Create donation record with status pending
    const donation = await createDonationRecord({
      user: req.user,
      charity,
      payload: { amount, currency, frequency: 'one-time', impactNote, metadata }
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      description: `Donation to ${charity.name}`,
      metadata: { donationId: donation._id.toString(), charityId: charity._id.toString() },
      receipt_email: req.user.email,
    });

    // Confirm payment immediately (automatic)
    donation.status = 'succeeded';
    donation.stripePaymentIntentId = paymentIntent.id;
    donation.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url || '';
    await donation.save();

    return res.status(201).json({ message: "Donation successful", donation });
  } catch (error) {
    console.error("One-time donation error", error);
    return res.status(500).json({ message: error.message || "Unable to create donation" });
  }
};

// --- Recurring Donation ---
const frequencyMap = {
  monthly: { interval: 'month', intervalCount: 1 },
  quarterly: { interval: 'month', intervalCount: 3 },
  annually: { interval: 'year', intervalCount: 1 },
};

const createRecurringDonation = async (req, res) => {
  try {
    if (!stripeReady) return res.status(500).json({ message: "Stripe not configured" });

    const { charityId, amount, frequency = 'monthly', currency = 'usd', metadata = {} } = req.body;
    if (!charityId || !amount) return res.status(400).json({ message: 'charityId and amount required' });
    if (!frequencyMap[frequency]) return res.status(400).json({ message: 'Unsupported frequency' });

    const charity = await ensureCharityExists(charityId);

    const donation = await createDonationRecord({
      user: req.user,
      charity,
      payload: { amount, currency, frequency, metadata }
    });

    const interval = frequencyMap[frequency];

    // Create Stripe Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: { name: `Recurring donation to ${charity.name}`, metadata: { charityId: charity._id.toString() } },
            recurring: { interval: interval.interval, interval_count: interval.intervalCount },
          },
          quantity: 1,
        },
      ],
      metadata: { donationId: donation._id.toString(), charityId: charity._id.toString(), donationType: 'recurring' },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations/cancel`,
    });

    donation.status = 'succeeded';
    donation.metadata = { ...donation.metadata, checkoutSessionId: session.id, checkoutUrl: session.url };
    await donation.save();

    return res.status(201).json({ donation, stripe: { configured: true, checkoutUrl: session.url, sessionId: session.id } });
  } catch (error) {
    console.error('Recurring donation error', error);
    return res.status(500).json({ message: error.message || 'Unable to create recurring donation' });
  }
};

// --- List Donations & Transparency ---
const listUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('charity', 'name mission coverImage')
      .sort({ createdAt: -1 });

    return res.json({ donations });
  } catch (error) {
    console.error('List donations error', error);
    return res.status(500).json({ message: 'Unable to fetch donations' });
  }
};

const listTransparencySummary = async (req, res) => {
  try {
    const summary = await Donation.aggregate([
      { $group: { _id: '$charity', totalAmount: { $sum: '$amount' }, donationCount: { $sum: 1 }, recurringCount: { $sum: { $cond: [{ $ne: ['$frequency', 'one-time'] }, 1, 0] } } } },
      { $lookup: { from: 'charities', localField: '_id', foreignField: '_id', as: 'charity' } },
      { $unwind: '$charity' },
      { $project: { _id: 0, charityId: '$charity._id', charityName: '$charity.name', mission: '$charity.mission', totalAmount: 1, donationCount: 1, recurringCount: 1, goals: '$charity.goals', transparencyUpdates: '$charity.transparencyUpdates' } },
      { $sort: { totalAmount: -1 } },
    ]);

    return res.json({ summary });
  } catch (error) {
    console.error('Transparency summary error', error);
    return res.status(500).json({ message: 'Unable to build transparency summary' });
  }
};

// --- Donation Receipt ---
const acknowledgeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('charity')
      .populate('user', '-password');

    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const receipt = generateReceipt({ donation, user: donation.user, charity: donation.charity });
    return res.json({ donation, receipt });
  } catch (error) {
    console.error('Acknowledge donation error', error);
    return res.status(500).json({ message: 'Unable to fetch donation receipt' });
  }
};

module.exports = {
  createOneTimeDonation,
  createRecurringDonation,
  listUserDonations,
  listTransparencySummary,
  acknowledgeDonation,
};