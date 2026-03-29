const asyncHandler = require('express-async-handler');
const FoodEntry = require('../models/FoodEntry');

const getFoodEntries = asyncHandler(async (req, res) => {
  const { date, startDate, endDate } = req.query;
  
  let query = { user: req.user.id };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  } else if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    query.date = { $gte: today, $lte: tomorrow };
  }

  const foodEntries = await FoodEntry.find(query).sort({ date: -1 });

  const totals = foodEntries.reduce((acc, entry) => {
    acc.calories += entry.calories;
    acc.protein += entry.protein;
    acc.carbs += entry.carbs;
    acc.fats += entry.fats;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  res.status(200).json({
    success: true,
    data: foodEntries,
    totals
  });
});

const addFoodEntry = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;

  const foodEntry = await FoodEntry.create(req.body);

  res.status(201).json({
    success: true,
    data: foodEntry
  });
});

const updateFoodEntry = asyncHandler(async (req, res) => {
  let foodEntry = await FoodEntry.findById(req.params.id);

  if (!foodEntry) {
    res.status(404);
    throw new Error('Food entry not found');
  }

  if (foodEntry.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this entry');
  }

  foodEntry = await FoodEntry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: foodEntry
  });
});

const deleteFoodEntry = asyncHandler(async (req, res) => {
  const foodEntry = await FoodEntry.findById(req.params.id);

  if (!foodEntry) {
    res.status(404);
    throw new Error('Food entry not found');
  }

  if (foodEntry.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this entry');
  }

  await foodEntry.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

const getWeeklyStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const foodEntries = await FoodEntry.find({
    user: req.user.id,
    date: { $gte: weekAgo, $lte: today }
  });

  const dailyStats = {};
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyStats[dateStr] = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }

  foodEntries.forEach(entry => {
    const dateStr = entry.date.toISOString().split('T')[0];
    if (dailyStats[dateStr]) {
      dailyStats[dateStr].calories += entry.calories;
      dailyStats[dateStr].protein += entry.protein;
      dailyStats[dateStr].carbs += entry.carbs;
      dailyStats[dateStr].fats += entry.fats;
    }
  });

  const statsArray = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    ...stats
  })).reverse();

  res.status(200).json({
    success: true,
    data: statsArray
  });
});

module.exports = {
  getFoodEntries,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getWeeklyStats
};
