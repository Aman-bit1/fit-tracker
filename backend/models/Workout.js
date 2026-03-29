const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Please provide workout type'],
    enum: ['running', 'walking', 'cycling', 'swimming', 'weight_training', 'yoga', 'hiit', 'other']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes'],
    min: [1, 'Duration must be at least 1 minute']
  },
  caloriesBurned: {
    type: Number,
    required: [true, 'Please provide calories burned'],
    min: [0, 'Calories burned cannot be negative']
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

workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
