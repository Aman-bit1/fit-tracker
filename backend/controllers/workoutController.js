const asyncHandler = require('express-async-handler');
const Workout = require('../models/Workout');

const workoutCaloriesPerMinute = {
  running: 10,
  walking: 3,
  cycling: 8,
  swimming: 9,
  weight_training: 6,
  yoga: 3,
  hiit: 12,
  other: 5
};

const getWorkouts = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  let query = { user: req.user.id };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const workouts = await Workout.find(query).sort({ date: -1 });

  const totalCalories = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

  res.status(200).json({
    success: true,
    data: workouts,
    totalCalories
  });
});

const addWorkout = asyncHandler(async (req, res) => {
  const { type, duration, date } = req.body;

  const caloriesPerMinute = workoutCaloriesPerMinute[type] || 5;
  const caloriesBurned = Math.round(duration * caloriesPerMinute);

  const workout = await Workout.create({
    user: req.user.id,
    type,
    duration,
    caloriesBurned,
    date: date || Date.now()
  });

  res.status(201).json({
    success: true,
    data: workout
  });
});

const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this workout');
  }

  await workout.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

const getWorkoutStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const workouts = await Workout.find({
    user: req.user.id,
    date: { $gte: weekAgo, $lte: today }
  });

  const dailyStats = {};
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyStats[dateStr] = { calories: 0, duration: 0 };
  }

  workouts.forEach(workout => {
    const dateStr = workout.date.toISOString().split('T')[0];
    if (dailyStats[dateStr]) {
      dailyStats[dateStr].calories += workout.caloriesBurned;
      dailyStats[dateStr].duration += workout.duration;
    }
  });

  const statsArray = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    ...stats
  })).reverse();

  const totalCalories = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalDuration = workouts.reduce((acc, w) => acc + w.duration, 0);

  res.status(200).json({
    success: true,
    data: statsArray,
    totals: { calories: totalCalories, duration: totalDuration }
  });
});

module.exports = {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  getWorkoutStats
};
