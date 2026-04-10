const User = require("../models/User");

// GET /users/profile
const getProfile = (req, res) => res.json({ user: req.user });

// PATCH /users/me — update display name and password
const updateProfile = async (req, res) => {
  try {
    const { name, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    if (newPassword) {
      if (newPassword.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
      user.password = newPassword; 
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// GET /users/admin/all — returns every user (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// DELETE /users/admin/:id — admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(400).json({ message: "Cannot delete an admin user" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

//POST /users/admin/create — admin creates a user
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, isAdmin: isAdmin || false, isVerified: true });
    await user.save();

    res.status(201).json({ message: "User created successfully", user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

//PATCH /users/admin/:id/toggle-admin
const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent self-demotion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own admin status" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    const action = user.isAdmin ? "promoted to admin" : "removed from admin";
    res.json({
      message: `${user.name} has been ${action}`,
      user: { _id: user._id, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser, createUserByAdmin, toggleAdmin };