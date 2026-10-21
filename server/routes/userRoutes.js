const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  getChannelProfile,
  toggleSubscribe,
  getUserSubscriptions
} = require('../controllers/userController');

router.get('/channel/:usernameOrId', optionalAuth, getChannelProfile);
router.post('/subscribe/:channelId', protect, toggleSubscribe);
router.get('/subscriptions/list', protect, getUserSubscriptions);

module.exports = router;
