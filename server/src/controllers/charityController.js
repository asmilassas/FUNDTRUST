const Charity = require("../models/Charity");

// Get All
const getCharities = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const charities = await Charity.find(filter)
      .populate("category", "name");

    res.json({ charities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch charities" });
  }
};

// Get Single
const getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ charity });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// Create
const createCharity = async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();

    res.status(201).json({
      message: "Project created successfully",
      charity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Update
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated", charity });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

// Delete
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};

// Add Update
const addProjectUpdate = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    const imagePaths = req.files
      ? req.files.map((file) => file.filename)
      : [];

    charity.transparencyUpdates.push({
      title: req.body.title,
      description: req.body.description,
      images: imagePaths,
    });

    await charity.save();

    res.json({ message: "Project update added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add update" });
  }
};

module.exports = {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
  addProjectUpdate,
};