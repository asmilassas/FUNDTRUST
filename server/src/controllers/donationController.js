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
  console.warn('Stripe SDK is not available. Ensure dependencies are installed.', error.message);
}

const stripeReady = Boolean(stripeClient);

const ensureCharityExists = async (charityId) => {
  if (!mongoose.Types.ObjectId.isValid(charityId)) {
    throw new Error('Invalid charity id');
  }

  const charity = await Charity.findById(charityId);
  if (!charity) {
    const error = new Error('Charity not found');
    error.status = 404;
    throw error;
  }

  return charity;
};

const createDonationRecord = async ({ user, charity, payload }) => {
  const donation = new Donation({
    user: user._id,
    charity: charity._id,
    amount: payload.amount,
    currency: payload.currency || 'usd',
    frequency: payload.frequency,
    impactNote: payload.impactNote,
    metadata: payload.metadata,
  });
  await donation.save();
  return donation;
};

const createOneTimeDonation = async (req, res) => {
  try {
    if (req.user.isAdmin) {
        return res.status(403).json({
       message: "Admins are not allowed to make donations",
        });
    }

    const {
      charityId,
      amount,
      currency = "usd",
      metadata = {},
      impactNote,
      paymentMethod = "stripe",
    } = req.body;

    if (!charityId || !amount) {
      return res.status(400).json({
        message: "charityId and amount are required",
      });
    }

    const charity = await ensureCharityExists(charityId);
    //  Prevent Overfunding
const goal = charity.goals?.[0];

if (goal) {
  const remainingAmount = goal.targetAmount - goal.amountRaised;

  if (remainingAmount <= 0) {
    return res.status(400).json({
      message: "This project is already fully funded.",
    });
  }

  if (Number(amount) > remainingAmount) {
    return res.status(400).json({
      message: `Only $${remainingAmount} remaining to complete this project.`,
    });
  }
}

    //Bank transfer logic
    if (paymentMethod === "bank") {
      if (!req.file) {
        return res.status(400).json({
          message: "Receipt image is required for bank transfer",
        });
      }

      const donation = new Donation({
        user: req.user._id,
        charity: charity._id,
        amount,
        currency,
        paymentMethod: "bank",
        receiptImage: req.file.filename,
        status: "pending",
      });

      await donation.save();

      return res.status(201).json({
        message: "Bank donation submitted. Awaiting admin approval.",
        donation,
      });
    }

    //Stripe (simulation mode)
    const donation = await createDonationRecord({
      user: req.user,
      charity,
      payload: {
        amount,
        currency,
        frequency: "one-time",
        impactNote,
        metadata,
      },
    });

    donation.paymentMethod = "stripe";

    if (!stripeReady) {
  donation.status = "succeeded";
  await donation.save();

  const charity = await Charity.findById(charity._id);
  if (charity && charity.goals && charity.goals.length > 0) {
    charity.goals[0].amountRaised += donation.amount;
    await charity.save();
  }

  return res.status(201).json({
    message: "Donation successful (Simulated)",
    donation,
  });
}

  } catch (error) {
    console.error("Create one-time donation error", error);
    return res.status(500).json({
      message: error.message || "Unable to create donation",
    });
  }
};

const frequencyMap = {
  monthly: { interval: 'month', intervalCount: 1 },
  quarterly: { interval: 'month', intervalCount: 3 },
  annually: { interval: 'year', intervalCount: 1 },
};

const createRecurringDonation = async (req, res) => {
  try {
    const { charityId, amount, frequency = 'monthly', currency = 'usd', metadata = {} } = req.body;

    if (!charityId || !amount) {
      return res.status(400).json({ message: 'charityId and amount are required' });
    }

    if (!frequencyMap[frequency]) {
      return res.status(400).json({ message: 'Unsupported frequency' });
    }

    const charity = await ensureCharityExists(charityId);

    const donation = await createDonationRecord({
      user: req.user,
      charity,
      payload: {
        amount,
        currency,
        frequency,
        metadata,
      },
    });

    if (!stripeReady) {
      donation.status = 'pending';
      donation.metadata = {
        ...donation.metadata,
        simulated: true,
        note: 'Stripe secret not configured. Recurring payment pending manual setup.',
      };
      await donation.save();
      return res.status(201).json({
        donation,
        stripe: { configured: false },
      });
    }

    const interval = frequencyMap[frequency];

    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Recurring donation to ${charity.name}`,
              metadata: {
                charityId: charity._id.toString(),
              },
            },
            recurring: {
              interval: interval.interval,
              interval_count: interval.intervalCount,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        donationId: donation._id.toString(),
        charityId: charity._id.toString(),
        donationType: 'recurring',
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations/cancel`,
    });

    donation.metadata = {
      ...donation.metadata,
      checkoutSessionId: session.id,
      checkoutUrl: session.url,
    };
    await donation.save();

    return res.status(201).json({
      donation,
      stripe: {
        configured: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error('Create recurring donation error', error);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Unable to create recurring donation' });
  }
};

const listUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate('charity', 'name mission coverImage')
      .sort({ createdAt: -1 });

    return res.json({ donations });
  } catch (error) {
    console.error('List user donations error', error);
    return res.status(500).json({ message: 'Unable to fetch donations' });
  }
};

const listTransparencySummary = async (req, res) => {
  try {
    const summary = await Donation.aggregate([
      {
        $group: {
          _id: '$charity',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 },
          recurringCount: {
            $sum: {
              $cond: [{ $ne: ['$frequency', 'one-time'] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'charities',
          localField: '_id',
          foreignField: '_id',
          as: 'charity',
        },
      },
      { $unwind: '$charity' },
      {
        $project: {
          _id: 0,
          charityId: '$charity._id',
          charityName: '$charity.name',
          mission: '$charity.mission',
          totalAmount: 1,
          donationCount: 1,
          recurringCount: 1,
          goals: '$charity.goals',
          transparencyUpdates: '$charity.transparencyUpdates',
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    return res.json({ summary });
  } catch (error) {
    console.error('Transparency summary error', error);
    return res.status(500).json({ message: 'Unable to build transparency summary' });
  }
};

const acknowledgeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('charity').populate('user', '-password');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (!req.user.isAdmin && donation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this receipt' });
    }

    const receipt = generateReceipt({ donation, user: donation.user, charity: donation.charity });

    return res.json({ donation, receipt });
  } catch (error) {
    console.error('Acknowledge donation error', error);
    return res.status(500).json({ message: 'Unable to fetch donation receipt' });
  }
};

const approveDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (donation.status === "succeeded") {
      return res.json({ message: "Donation already approved" });
    }

    const charity = await Charity.findById(donation.charity);

    if (!charity || !charity.goals || charity.goals.length === 0) {
      return res.status(400).json({ message: "Project goal not found" });
    }

    const goal = charity.goals[0];
    const remainingAmount = goal.targetAmount - goal.amountRaised;

    //  Already completed
    if (remainingAmount <= 0) {
      return res.status(400).json({
        message: "Project already fully funded",
      });
    }

    //  Prevent overfunding
    if (donation.amount > remainingAmount) {
      return res.status(400).json({
        message: `Only $${remainingAmount} remaining. Donation exceeds limit.`,
      });
    }

    //  Approve donation
    donation.status = "succeeded";
    await donation.save();

    // Save previous amount for comparison
    const previousAmount = goal.amountRaised;

    // Update goal
    goal.amountRaised += donation.amount;
    await charity.save();

    //  If project JUST reached full funding → notify donors
    if (
      previousAmount < goal.targetAmount &&
      goal.amountRaised >= goal.targetAmount
    ) {
      const donors = await Donation.find({
        charity: charity._id,
        status: "succeeded",
      }).populate("user");

      const User = require("../models/User");

      for (const d of donors) {
        await User.findByIdAndUpdate(d.user._id, {
          $push: {
            notifications: {
              message: `🎉 The project "${charity.name}" has been fully funded! Thank you for your support.`,
            },
          },
        });
      }
    }

    res.json({
      message: "Donation approved and project updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Approval failed" });
  }
};

const getPendingDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      paymentMethod: "bank",
      status: "pending",   // 🔥 MUST be pending only
    })
      .populate("user", "name email")
      .populate("charity", "name");

    res.json({ donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending donations" });
  }
};

const rejectDonation = async (req, res) => {
  try {
    const { reason } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({
        message: "Only pending donations can be rejected",
      });
    }

    donation.status = "rejected";
    donation.rejectionReason = reason || "Rejected by admin";

    await donation.save();

    //Send notification to user
    const User = require("../models/User");

    await User.findByIdAndUpdate(donation.user, {
      $push: {
        notifications: {
          message: `❌ Your donation was rejected. Reason: ${donation.rejectionReason}`,
          createdAt: new Date(),
        },
      },
    });

    res.json({ message: "Donation rejected successfully" });

  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Rejection failed" });
  }
};

module.exports = {
  createOneTimeDonation,
  createRecurringDonation,
  listUserDonations,
  listTransparencySummary,
  acknowledgeDonation,
  approveDonation,
  getPendingDonations,
  rejectDonation
};