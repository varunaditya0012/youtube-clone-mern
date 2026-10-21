const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const { getRecommendations } = require('../controllers/recommendationController');

router.get('/', optionalAuth, getRecommendations);

module.exports = router;
