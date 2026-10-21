const Video = require('../models/Video');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Subscription = require('../models/Subscription');

// @desc    Upload / Create a new video
// @route   POST /api/videos
// @access  Private
const createVideo = async (req, res, next) => {
  try {
    const { title, description, category, tags, duration } = req.body;

    let videoUrl = req.body.videoUrl;
    let thumbnailUrl = req.body.thumbnailUrl;

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
      }
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a video title' });
    }

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a video file or provide a video URL' });
    }

    if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    }

    // Process tags
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      }
    }

    const video = await Video.create({
      title,
      description: description || '',
      videoUrl,
      thumbnailUrl,
      duration: duration || '4:15',
      category: category || 'General',
      tags: processedTags,
      channel: req.user._id,
      views: 0,
      likes: [],
      dislikes: [],
      sharesCount: 0
    });

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all videos with optional category & sorting
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res, next) => {
  try {
    const { category, sort, page = 1, limit = 24 } = req.query;
    const filter = { visibility: 'public' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    let allVideos = await Video.find(filter);

    if (sort === 'trending') {
      allVideos.sort((a, b) => (b.views + (b.likes ? b.likes.length * 5 : 0)) - (a.views + (a.likes ? a.likes.length * 5 : 0)));
    } else if (sort === 'top') {
      allVideos.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));
    } else {
      // default: latest
      allVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const skip = (Number(page) - 1) * Number(limit);
    const paginated = allVideos.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      count: paginated.length,
      total: allVideos.length,
      page: Number(page),
      pages: Math.ceil(allVideos.length / Number(limit)),
      videos: paginated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public (Optional Auth for like/sub status)
const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    let isLiked = false;
    let isDisliked = false;
    let isSubscribed = false;

    if (req.user) {
      const userIdStr = String(req.user._id);
      isLiked = Array.isArray(video.likes) && video.likes.some(id => String(id) === userIdStr);
      isDisliked = Array.isArray(video.dislikes) && video.dislikes.some(id => String(id) === userIdStr);

      const channelId = video.channel._id || video.channel;
      const sub = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
      });
      isSubscribed = !!sub;
    }

    res.json({
      success: true,
      video,
      userInteraction: {
        isLiked,
        isDisliked,
        isSubscribed
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record view & add to watch history
// @route   POST /api/videos/:id/view
// @access  Public (Optional Auth)
const recordView = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        let history = user.history || [];
        // Filter out existing occurrence of this video in recent entries to bump to top
        history = history.filter(h => String(h.video) !== String(video._id));
        history.unshift({ video: video._id, watchedAt: new Date() });
        // Keep last 100 history items
        if (history.length > 100) history = history.slice(0, 100);

        await User.findByIdAndUpdate(req.user._id, { $set: { history } });
      }
    }

    res.json({ success: true, views: video.views });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on video
// @route   POST /api/videos/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const userId = req.user._id;
    const userIdStr = String(userId);
    const hasLiked = video.likes && video.likes.some(id => String(id) === userIdStr);
    const hasDisliked = video.dislikes && video.dislikes.some(id => String(id) === userIdStr);

    let updatedVideo;
    if (hasLiked) {
      // Remove like
      updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        { $pull: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(userId, { $pull: { likedVideos: video._id } });
    } else {
      // Add like and remove dislike if present
      const update = { $addToSet: { likes: userId } };
      if (hasDisliked) {
        update.$pull = { dislikes: userId };
      }
      updatedVideo = await Video.findByIdAndUpdate(video._id, update, { new: true });
      await User.findByIdAndUpdate(userId, { $addToSet: { likedVideos: video._id } });
    }

    res.json({
      success: true,
      likesCount: updatedVideo.likes ? updatedVideo.likes.length : 0,
      dislikesCount: updatedVideo.dislikes ? updatedVideo.dislikes.length : 0,
      isLiked: !hasLiked,
      isDisliked: false
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle dislike on video
// @route   POST /api/videos/:id/dislike
// @access  Private
const toggleDislike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const userId = req.user._id;
    const userIdStr = String(userId);
    const hasLiked = video.likes && video.likes.some(id => String(id) === userIdStr);
    const hasDisliked = video.dislikes && video.dislikes.some(id => String(id) === userIdStr);

    let updatedVideo;
    if (hasDisliked) {
      // Remove dislike
      updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        { $pull: { dislikes: userId } },
        { new: true }
      );
    } else {
      // Add dislike and remove like if present
      const update = { $addToSet: { dislikes: userId } };
      if (hasLiked) {
        update.$pull = { likes: userId };
        await User.findByIdAndUpdate(userId, { $pull: { likedVideos: video._id } });
      }
      updatedVideo = await Video.findByIdAndUpdate(video._id, update, { new: true });
    }

    res.json({
      success: true,
      likesCount: updatedVideo.likes ? updatedVideo.likes.length : 0,
      dislikesCount: updatedVideo.dislikes ? updatedVideo.dislikes.length : 0,
      isLiked: false,
      isDisliked: !hasDisliked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record share event
// @route   POST /api/videos/:id/share
// @access  Public
const recordShare = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { sharesCount: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({
      success: true,
      sharesCount: video.sharesCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search videos by query
// @route   GET /api/videos/search
// @access  Public
const searchVideos = async (req, res, next) => {
  try {
    const { q, category, sort } = req.query;

    if (!q || !q.trim()) {
      return res.json({ success: true, count: 0, videos: [] });
    }

    const queryTerm = q.trim().toLowerCase();
    let allVideos = await Video.find({ visibility: 'public' });

    // Filter by query matching title, description, tags, channel
    let matched = allVideos.filter(v => {
      const inTitle = (v.title || '').toLowerCase().includes(queryTerm);
      const inDesc = (v.description || '').toLowerCase().includes(queryTerm);
      const inTags = Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase().includes(queryTerm));
      const inChannel = v.channel && ((v.channel.name || '').toLowerCase().includes(queryTerm) || (v.channel.username || '').toLowerCase().includes(queryTerm));
      return inTitle || inDesc || inTags || inChannel;
    });

    if (category && category !== 'All') {
      matched = matched.filter(v => v.category === category);
    }

    if (sort === 'views') {
      matched.sort((a, b) => b.views - a.views);
    } else if (sort === 'likes') {
      matched.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));
    } else {
      matched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: matched.length,
      videos: matched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get videos from subscribed channels
// @route   GET /api/videos/subscriptions
// @access  Private
const getSubscribedVideos = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ subscriber: req.user._id });
    const channelIds = subs.map(s => String(s.channel._id || s.channel));

    if (channelIds.length === 0) {
      return res.json({ success: true, count: 0, videos: [] });
    }

    const allVideos = await Video.find({ visibility: 'public' });
    const subscribedVideos = allVideos
      .filter(v => {
        const cId = String(v.channel._id || v.channel);
        return channelIds.includes(cId);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: subscribedVideos.length,
      videos: subscribedVideos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's liked videos
// @route   GET /api/videos/liked
// @access  Private
const getLikedVideos = async (req, res, next) => {
  try {
    const userIdStr = String(req.user._id);
    const allVideos = await Video.find({ visibility: 'public' });
    const liked = allVideos.filter(v => Array.isArray(v.likes) && v.likes.some(id => String(id) === userIdStr));

    res.json({
      success: true,
      count: liked.length,
      videos: liked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's watch history
// @route   GET /api/videos/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.history || user.history.length === 0) {
      return res.json({ success: true, count: 0, videos: [] });
    }

    const videoHistory = [];
    for (const h of user.history) {
      const v = await Video.findById(h.video);
      if (v) {
        videoHistory.push({
          ...v,
          watchedAt: h.watchedAt
        });
      }
    }

    res.json({
      success: true,
      count: videoHistory.length,
      videos: videoHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user's watch history
// @route   DELETE /api/videos/history
// @access  Private
const clearHistory = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { history: [] } });
    res.json({ success: true, message: 'Watch history cleared successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const ownerId = String(video.channel._id || video.channel);
    if (ownerId !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this video' });
    }

    await Video.findByIdAndDelete(video._id);
    await Comment.deleteMany({ video: video._id });

    res.json({ success: true, message: 'Video removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
