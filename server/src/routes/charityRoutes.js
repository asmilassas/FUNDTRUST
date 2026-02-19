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

router.get('/', getCharities);
router.get('/:id', getCharity);

router.post('/', authMiddleware, createCharity);
router.patch('/:id', authMiddleware, updateCharity);
router.delete('/:id', authMiddleware, deleteCharity);

module.exports = router;
