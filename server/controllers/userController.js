const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

// @desc    Get channel profile & its videos
// @route   GET /api/users/channel/:usernameOrId
// @access  Public (Optional Auth)
const getChannelProfile = async (req, res, next) => {
  try {
    const param = req.params.usernameOrId;
    let channel = await User.findOne({ username: param.toLowerCase() });

    if (!channel) {
      channel = await User.findById(param);
    }

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const videos = await Video.find({
      channel: channel._id,
      visibility: 'public'
    });
    videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let isSubscribed = false;
    let isSelf = false;

    if (req.user) {
      isSelf = String(req.user._id) === String(channel._id);
      const sub = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channel._id
      });
      isSubscribed = !!sub;
    }

    res.json({
      success: true,
      channel: {
        _id: channel._id,
        name: channel.name,
        username: channel.username,
        avatar: channel.avatar,
        banner: channel.banner,
        description: channel.description,
        subscribersCount: channel.subscribersCount || 0,
        createdAt: channel.createdAt
      },
      videos,
      isSubscribed,
      isSelf
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe / Unsubscribe to channel
// @route   POST /api/users/subscribe/:channelId
// @access  Private
const toggleSubscribe = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const subscriberId = req.user._id;

    if (String(subscriberId) === String(channelId)) {
      return res.status(400).json({ success: false, message: 'You cannot subscribe to your own channel' });
    }

    const channel = await User.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const existingSub = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId
    });

    let isSubscribed = false;
    if (existingSub) {
      // Unsubscribe
      await Subscription.deleteOne({
        subscriber: subscriberId,
        channel: channelId
      });
      await User.findByIdAndUpdate(channelId, { $inc: { subscribersCount: -1 } });
      await User.findByIdAndUpdate(subscriberId, { $pull: { subscribedChannels: channelId } });
      isSubscribed = false;
    } else {
      // Subscribe
      await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
      });
      await User.findByIdAndUpdate(channelId, { $inc: { subscribersCount: 1 } });
      await User.findByIdAndUpdate(subscriberId, { $addToSet: { subscribedChannels: channelId } });
      isSubscribed = true;
    }

    const updatedChannel = await User.findById(channelId);

    res.json({
      success: true,
      isSubscribed,
      subscribersCount: Math.max(0, updatedChannel.subscribersCount || 0)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribed channels for logged in user
// @route   GET /api/users/subscriptions/list
// @access  Private
const getUserSubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ subscriber: req.user._id });
    const channels = subs.map(s => s.channel).filter(Boolean);

    res.json({
      success: true,
      count: channels.length,
      channels
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChannelProfile,
  toggleSubscribe,
  getUserSubscriptions
};
