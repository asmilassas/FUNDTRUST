const express = require("express");
const router = express.Router();

const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
  addProjectUpdate,
} = require("../controllers/charityController");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");


// =============================
// Public Routes
// =============================

// Get all charities
router.get("/", getCharities);

// Get single charity
router.get("/:id", getCharity);


// =============================
// Admin Only Routes
// =============================

// Create charity
router.post("/", protect, adminOnly, createCharity);

// Update charity basic info
router.patch("/:id", protect, adminOnly, updateCharity);

// Delete charity
router.delete("/:id", protect, adminOnly, deleteCharity);

// Add transparency/project update
router.post(
  "/:id/update",
  protect,
  adminOnly,
  upload.array("images", 5),
  addProjectUpdate
);
// Admin - Get all projects
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const charities = await require("../models/Charity")
      .find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ charities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});


module.exports = router;
