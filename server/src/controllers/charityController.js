const Charity = require("../models/Charity");


// =============================
// Get All Charities
// =============================
const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json({ charities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch charities" });
  }
};


// =============================
// Get Single Charity
// =============================
const getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ charity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};


// =============================
// Create Charity
// =============================
const createCharity = async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();

    res.status(201).json({ message: "Project created successfully", charity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};


// =============================
// Update Charity
// =============================
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
    console.error(error);
    res.status(500).json({ message: "Failed to update project" });
  }
};


// =============================
// Delete Charity
// =============================
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};


// =============================
// Add Transparency Update
// =============================
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
    console.error(error);
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
