const Comment = require('../models/Comment');

// @desc    Get comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
const getVideoComments = async (req, res, next) => {
  try {
    const commentsList = await Comment.find({ video: req.params.videoId });
    res.json({
      success: true,
      count: commentsList.length,
      comments: commentsList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to video
// @route   POST /api/comments/:videoId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const comment = await Comment.create({
      video: req.params.videoId,
      user: req.user._id,
      text: text.trim(),
      likes: []
    });

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on comment
// @route   POST /api/comments/like/:id
// @access  Private
const toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userIdStr = String(req.user._id);
    const hasLiked = Array.isArray(comment.likes) && comment.likes.some(id => String(id) === userIdStr);

    let updated;
    if (hasLiked) {
      updated = await Comment.findByIdAndUpdate(
        comment._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
    } else {
      updated = await Comment.findByIdAndUpdate(
        comment._id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );
    }

    res.json({
      success: true,
      likesCount: updated.likes ? updated.likes.length : 0,
      isLiked: !hasLiked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const authorId = String(comment.user._id || comment.user);
    if (authorId !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(comment._id);
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideoComments,
  addComment,
  toggleCommentLike,
  deleteComment
};
