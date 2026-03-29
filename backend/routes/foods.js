const express = require('express');
const router = express.Router();
const { 
  getFoodEntries, 
  addFoodEntry, 
  updateFoodEntry, 
  deleteFoodEntry,
  getWeeklyStats 
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getFoodEntries)
  .post(protect, addFoodEntry);

router.route('/weekly')
  .get(protect, getWeeklyStats);

router.route('/:id')
  .put(protect, updateFoodEntry)
  .delete(protect, deleteFoodEntry);

module.exports = router;
