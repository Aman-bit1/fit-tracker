const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getGoals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatsGoal: user.fatsGoal
    }
  });
});

const updateGoals = asyncHandler(async (req, res) => {
  const { calorieGoal, proteinGoal, carbsGoal, fatsGoal } = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, {
    calorieGoal,
    proteinGoal,
    carbsGoal,
    fatsGoal
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: {
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatsGoal: user.fatsGoal
    }
  });
});

module.exports = {
  getGoals,
  updateGoals
};
