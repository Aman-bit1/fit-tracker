const express = require('express');
const router = express.Router();
const { getGoals, updateGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getGoals)
  .put(protect, updateGoals);

module.exports = router;
