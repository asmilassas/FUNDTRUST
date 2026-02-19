const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getProfile, updateProfile, updatePreferences } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.patch('/preferences', updatePreferences);

module.exports = router;
