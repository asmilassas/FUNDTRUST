const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
} = require('../controllers/charityController');

const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/:id/update",
  protect,
  upload.array("images", 5),   // max 5 images
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const charity = await require("../models/Charity").findById(req.params.id);

      if (!charity) {
        return res.status(404).json({ message: "Project not found" });
      }

      const imagePaths = req.files ? req.files.map(file => file.filename) : [];

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
  }
);

router.get('/', getCharities);
router.get('/:id', getCharity);

router.post('/', authMiddleware, createCharity);
router.patch('/:id', authMiddleware, updateCharity);
router.delete('/:id', authMiddleware, deleteCharity);

module.exports = router;
