const express = require('express');
const router = express.Router();
const { searchFood } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, searchFood);

module.exports = router;
