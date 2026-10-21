const Video = require('../models/Video');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Get personalized video recommendations
// @route   GET /api/recommendations
// @access  Public (Enhanced when authenticated)
const getRecommendations = async (req, res, next) => {
  try {
    const { currentVideoId, limit = 20 } = req.query;
    const allVideos = await Video.find({ visibility: 'public' });

    if (allVideos.length === 0) {
      return res.json({ success: true, count: 0, videos: [] });
    }

    let userHistoryVideoIds = new Set();
    let preferredCategories = new Map();
    let preferredTags = new Set();
    let subscribedChannelIds = new Set();
    let likedVideoIds = new Set();

    // 1. Gather User Affinity Profile
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Collect liked videos
        if (Array.isArray(user.likedVideos)) {
          user.likedVideos.forEach(id => likedVideoIds.add(String(id)));
        }

        // Subscriptions
        const subs = await Subscription.find({ subscriber: user._id });
        subs.forEach(s => subscribedChannelIds.add(String(s.channel._id || s.channel)));

        // Analyze watch history
        if (Array.isArray(user.history)) {
          user.history.forEach(h => {
            userHistoryVideoIds.add(String(h.video));
          });
        }
      }

      // Build interest profiles from history & liked videos
      for (const v of allVideos) {
        const strId = String(v._id);
        const isWatched = userHistoryVideoIds.has(strId);
        const isLiked = likedVideoIds.has(strId);

        if (isWatched || isLiked) {
          const cat = v.category;
          if (cat) {
            preferredCategories.set(cat, (preferredCategories.get(cat) || 0) + (isLiked ? 3 : 1));
          }
          if (Array.isArray(v.tags)) {
            v.tags.forEach(t => preferredTags.add(t.toLowerCase()));
          }
        }
      }
    }

    // 2. Contextual video (if requested from video watch page)
    let currentVideo = null;
    if (currentVideoId) {
      currentVideo = allVideos.find(v => String(v._id) === String(currentVideoId));
    }

    // 3. Score every video
    const scoredVideos = allVideos
      .filter(v => {
        // Exclude current video from suggestions if provided
        if (currentVideoId && String(v._id) === String(currentVideoId)) {
          return false;
        }
        return true;
      })
      .map(video => {
        let score = 0;
        const vId = String(video._id);
        const channelId = String(video.channel._id || video.channel);

        // Subscribed channel boost (+15)
        if (subscribedChannelIds.has(channelId)) {
          score += 15;
        }

        // Category affinity boost (+10 * weight)
        if (preferredCategories.has(video.category)) {
          score += (preferredCategories.get(video.category) || 1) * 6;
        }

        // Shared tags with user profile (+4 per tag)
        if (Array.isArray(video.tags)) {
          video.tags.forEach(t => {
            if (preferredTags.has(t.toLowerCase())) {
              score += 4;
            }
          });
        }

        // Contextual Video Matches (Watch Page "Up Next")
        if (currentVideo) {
          // Same category match (+20)
          if (video.category === currentVideo.category) {
            score += 20;
          }
          // Same channel match (+15)
          if (channelId === String(currentVideo.channel._id || currentVideo.channel)) {
            score += 15;
          }
          // Shared tag match (+8 per matching tag)
          if (Array.isArray(video.tags) && Array.isArray(currentVideo.tags)) {
            const currentTags = new Set(currentVideo.tags.map(t => t.toLowerCase()));
            video.tags.forEach(t => {
              if (currentTags.has(t.toLowerCase())) {
                score += 8;
              }
            });
          }
        }

        // General engagement metric: views and like ratio
        const likesCount = Array.isArray(video.likes) ? video.likes.length : 0;
        const viewsCount = video.views || 0;
        const engagementScore = Math.min(25, (viewsCount * 0.05) + (likesCount * 3));
        score += engagementScore;

        // Recency boost (up to +10 for newer videos within 14 days)
        const daysOld = Math.max(0, (Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        const recencyScore = Math.max(0, 10 - daysOld * 0.5);
        score += recencyScore;

        // Penalty if already watched recently so feed discovers fresh content
        if (userHistoryVideoIds.has(vId) && !currentVideoId) {
          score -= 10;
        }

        return {
          ...video,
          recommendationScore: Math.round(score * 10) / 10
        };
      });

    // Sort descending by calculated score
    scoredVideos.sort((a, b) => b.recommendationScore - a.recommendationScore);

    const recommendations = scoredVideos.slice(0, Number(limit));

    res.json({
      success: true,
      count: recommendations.length,
      isPersonalized: !!req.user,
      videos: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
