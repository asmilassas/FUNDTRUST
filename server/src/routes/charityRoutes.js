const express = require("express");
const router = express.Router();
const { getCharities, getCharity, createCharity, updateCharity, deleteCharity, addProjectUpdate } = require("../controllers/charityController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


// Public Routes
router.get("/", getCharities);

// /admin/all MUST be before /:id to avoid Express treating "admin" as an id
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const Charity = require("../models/Charity");
    const charities = await Charity.find().populate("category", "name").sort({ createdAt: -1 });
    res.json({ charities });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

router.get("/:id", getCharity);

// Admin — support optional single cover image upload on create/update
router.post("/", protect, admin, upload.single("coverImage"), createCharity);
router.patch("/:id", protect, admin, upload.single("coverImage"), updateCharity);
router.delete("/:id", protect, admin, deleteCharity);

// Transparency update with multiple images
router.post("/:id/update", protect, admin, upload.array("images", 5), addProjectUpdate);

module.exports = router;