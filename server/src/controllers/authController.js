const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Register error', error);
    return res.status(500).json({ message: 'Unable to register user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ message: 'Unable to login' });
  }
};

module.exports = {
  register,
  login,
};
