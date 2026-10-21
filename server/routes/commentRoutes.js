const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getVideoComments,
  addComment,
  toggleCommentLike,
  deleteComment
} = require('../controllers/commentController');

router.get('/:videoId', getVideoComments);
router.post('/:videoId', protect, addComment);
router.post('/like/:id', protect, toggleCommentLike);
router.delete('/:id', protect, deleteComment);

module.exports = router;
