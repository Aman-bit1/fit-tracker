const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true,
    maxlength: [100, 'Food name cannot exceed 100 characters']
  },
  calories: {
    type: Number,
    required: [true, 'Please provide calories'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    default: 0,
    min: [0, 'Protein cannot be negative']
  },
  carbs: {
    type: Number,
    default: 0,
    min: [0, 'Carbs cannot be negative']
  },
  fats: {
    type: Number,
    default: 0,
    min: [0, 'Fats cannot be negative']
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack'
  },
  date: {
    type: Date,
    required: [true, 'Please provide date'],
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

foodEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);
