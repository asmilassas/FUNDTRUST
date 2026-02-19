const User = require('../models/User');

const getProfile = (req, res) => {
  return res.json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;

    if (!name && !avatarUrl) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (avatarUrl) updates.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: '-password',
    });

    return res.json({ user });
  } catch (error) {
    console.error('Update profile error', error);
    return res.status(500).json({ message: 'Unable to update profile' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ message: 'Preferences payload is required' });
    }

    const user = await User.findById(req.user._id).select('-password');
    user.preferences = { ...user.preferences.toObject(), ...preferences };
    await user.save();

    return res.json({ user });
  } catch (error) {
    console.error('Update preferences error', error);
    return res.status(500).json({ message: 'Unable to update preferences' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
};
