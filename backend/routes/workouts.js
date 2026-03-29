const express = require('express');
const router = express.Router();
const { 
  getWorkouts, 
  addWorkout, 
  deleteWorkout,
  getWorkoutStats 
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, addWorkout);

router.route('/stats')
  .get(protect, getWorkoutStats);

router.route('/:id')
  .delete(protect, deleteWorkout);

module.exports = router;
