const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { videos, users } = require('../data/store');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a video title'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide video file or URL']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Please provide a thumbnail image URL']
  },
  duration: {
    type: String,
    default: '0:00'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Music', 'Gaming', 'Tech', 'Education', 'Entertainment', 'News', 'Sports', 'Podcasts'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'public'
  },
  sharesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });

const MongooseVideo = mongoose.model('Video', VideoSchema);

// Populate helper for store
async function populateChannel(videoList) {
  const isArray = Array.isArray(videoList);
  const list = isArray ? videoList : [videoList];
  if (!list[0]) return isArray ? [] : null;

  const populated = [];
  for (const v of list) {
    if (!v) continue;
    let channelDoc = null;
    if (v.channel && typeof v.channel === 'object' && v.channel.username) {
      channelDoc = v.channel;
    } else if (v.channel) {
      const u = await users.findById(v.channel);
      if (u) {
        channelDoc = {
          _id: u._id,
          name: u.name,
          username: u.username,
          avatar: u.avatar,
          subscribersCount: u.subscribersCount || 0
        };
      }
    }
    populated.push({
      ...v,
      channel: channelDoc || {
        _id: v.channel || 'unknown',
        name: 'Channel',
        username: 'creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        subscribersCount: 0
      }
    });
  }
  return isArray ? populated : populated[0];
}

const Video = {
  schema: VideoSchema,
  async find(filter = {}) {
    if (getIsConnected()) {
      return MongooseVideo.find(filter).populate('channel', 'name username avatar subscribersCount');
    }
    const raw = await videos.find(filter);
    return populateChannel(raw);
  },
  async findById(id) {
    if (getIsConnected()) {
      return MongooseVideo.findById(id).populate('channel', 'name username avatar subscribersCount');
    }
    const raw = await videos.findById(id);
    if (!raw) return null;
    return populateChannel(raw);
  },
  async findOne(filter = {}) {
    if (getIsConnected()) {
      return MongooseVideo.findOne(filter).populate('channel', 'name username avatar subscribersCount');
    }
    const raw = await videos.findOne(filter);
    if (!raw) return null;
    return populateChannel(raw);
  },
  async create(data) {
    if (getIsConnected()) {
      const created = await MongooseVideo.create(data);
      return created.populate('channel', 'name username avatar subscribersCount');
    }
    const doc = {
      ...data,
      views: data.views || 0,
      likes: data.likes || [],
      dislikes: data.dislikes || [],
      sharesCount: data.sharesCount || 0,
      tags: data.tags || [],
      visibility: data.visibility || 'public',
      duration: data.duration || '3:45'
    };
    const created = await videos.create(doc);
    return populateChannel(created);
  },
  async findByIdAndUpdate(id, update, options) {
    if (getIsConnected()) {
      return MongooseVideo.findByIdAndUpdate(id, update, options).populate('channel', 'name username avatar subscribersCount');
    }
    const updated = await videos.findByIdAndUpdate(id, update, options);
    if (!updated) return null;
    return populateChannel(updated);
  },
  async findByIdAndDelete(id) {
    if (getIsConnected()) {
      return MongooseVideo.findByIdAndDelete(id);
    }
    return videos.findByIdAndDelete(id);
  },
  async countDocuments(filter = {}) {
    if (getIsConnected()) return MongooseVideo.countDocuments(filter);
    return videos.countDocuments(filter);
  },
  async deleteMany(filter = {}) {
    if (getIsConnected()) return MongooseVideo.deleteMany(filter);
    return videos.deleteMany(filter);
  }
};

module.exports = Video;
