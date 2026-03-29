const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const goalRoutes = require('./routes/goals');
const workoutRoutes = require('./routes/workouts');
const searchRoutes = require('./routes/search');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitTrack Pro API is running' });
});

app.post('/api/auth/test-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/debug', (req, res) => {
  res.json({ 
    message: 'Auth debug endpoint',
    tokenHeader: req.headers.authorization ? 'present' : 'missing',
    corsOrigin: req.headers.origin
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

module.exports = app;
