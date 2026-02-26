const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { createComment, getComments } = require("../controllers/commentController");

router.get("/", getComments);
router.post("/", protect, createComment);

module.exports = router;