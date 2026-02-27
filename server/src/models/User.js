const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const preferenceSchema = new mongoose.Schema(
  {
    newslettersOptIn: { type: Boolean, default: true },
    impactAlertsOptIn: { type: Boolean, default: true },
    defaultDonationAmount: { type: Number },
    defaultDonationFrequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'annually'],
      default: 'one-time',
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatarUrl: { type: String },
    isAdmin: { type: Boolean, default: false },
    preferences: { type: preferenceSchema, default: () => ({}) },

    // 🔐 OTP Fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },

    // 🔔 Notifications
    notifications: [
      {
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);