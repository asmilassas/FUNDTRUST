const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Import controller functions
const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
  addProjectUpdate,
  getAllCharitiesAdmin
} = require("../controllers/charityController");

const router = express.Router();

// GET /api/charities - Public list with filters, pagination, search
router.get("/", getCharities);

// GET /api/charities/admin/all - Admin
router.get("/admin/all", protect, admin, getAllCharitiesAdmin);

// GET /api/charities/:id
router.get("/:id", getCharity);

// POST /api/charities - Create charity (admin only)
router.post("/", protect, admin, upload.single("coverImage"), createCharity);

// PATCH /api/charities/:id - Update charity (admin only)
router.patch("/:id", protect, admin, upload.single("coverImage"), updateCharity);

// DELETE /api/charities/:id - Delete charity (admin only)
router.delete("/:id", protect, admin, deleteCharity);

// POST /api/charities/:id/update - Add project update (admin only)
router.post("/:id/update", protect, admin, upload.array("images", 5), addProjectUpdate);

module.exports = router;