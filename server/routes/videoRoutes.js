const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  createVideo,
  getVideos,
  getVideoById,
  recordView,
  toggleLike,
  toggleDislike,
  recordShare,
  searchVideos,
  getSubscribedVideos,
  getLikedVideos,
  getHistory,
  clearHistory,
  deleteVideo
} = require('../controllers/videoController');

router.get('/search', searchVideos);
router.get('/subscriptions', protect, getSubscribedVideos);
router.get('/liked', protect, getLikedVideos);
router.get('/history', protect, getHistory);
router.delete('/history', protect, clearHistory);

router.route('/')
  .get(getVideos)
  .post(
    protect,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    createVideo
  );

router.route('/:id')
  .get(optionalAuth, getVideoById)
  .delete(protect, deleteVideo);

router.post('/:id/view', optionalAuth, recordView);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/dislike', protect, toggleDislike);
router.post('/:id/share', recordShare);

module.exports = router;
