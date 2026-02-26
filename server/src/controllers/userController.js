const User = require("../models/User");

/*
   USER PROFILE FUNCTIONS
*/

const getProfile = (req, res) => {
  return res.json({ user: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;

    if (!name && !avatarUrl) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (avatarUrl) updates.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    return res.json({ user });
  } catch (error) {
    console.error("Update profile error", error);
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ message: "Preferences payload is required" });
    }

    const user = await User.findById(req.user._id).select("-password");

    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();

    return res.json({ user });
  } catch (error) {
    console.error("Update preferences error", error);
    return res.status(500).json({ message: "Unable to update preferences" });
  }
};

/* 
   ADMIN FUNCTIONS
*/

//  Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//  Delete User (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password, // will be hashed automatically
      isAdmin: isAdmin || false,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error("Admin create user error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    await user.save();

    res.json({ message: "User updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};



module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  getAllUsers,
  deleteUser,
  createUserByAdmin,
  updateUserByAdmin
};