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

const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public Routes
router.get("/", getCharities);
router.get("/:id", getCharity);

// Admin Routes
router.post("/", protect, admin, createCharity);
router.patch("/:id", protect, admin, updateCharity);
router.delete("/:id", protect, admin, deleteCharity);

router.post(
  "/:id/update",
  protect,
  admin,
  upload.array("images", 5),
  addProjectUpdate
);

router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const Charity = require("../models/Charity");

    const charities = await Charity.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ charities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

module.exports = router;