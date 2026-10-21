const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { comments, users } = require('../data/store');

const CommentSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const MongooseComment = mongoose.model('Comment', CommentSchema);

async function populateUser(commentList) {
  const isArray = Array.isArray(commentList);
  const list = isArray ? commentList : [commentList];
  if (!list[0]) return isArray ? [] : null;

  const populated = [];
  for (const c of list) {
    if (!c) continue;
    let userDoc = null;
    if (c.user && typeof c.user === 'object' && c.user.username) {
      userDoc = c.user;
    } else if (c.user) {
      const u = await users.findById(c.user);
      if (u) {
        userDoc = {
          _id: u._id,
          name: u.name,
          username: u.username,
          avatar: u.avatar
        };
      }
    }
    populated.push({
      ...c,
      user: userDoc || {
        _id: c.user || 'guest',
        name: 'Viewer',
        username: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      }
    });
  }
  return isArray ? populated : populated[0];
}

const Comment = {
  schema: CommentSchema,
  async find(filter = {}) {
    if (getIsConnected()) {
      return MongooseComment.find(filter).populate('user', 'name username avatar').sort({ createdAt: -1 });
    }
    const raw = await comments.find(filter);
    raw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return populateUser(raw);
  },
  async findById(id) {
    if (getIsConnected()) {
      return MongooseComment.findById(id).populate('user', 'name username avatar');
    }
    const raw = await comments.findById(id);
    if (!raw) return null;
    return populateUser(raw);
  },
  async create(data) {
    if (getIsConnected()) {
      const created = await MongooseComment.create(data);
      return created.populate('user', 'name username avatar');
    }
    const doc = {
      ...data,
      likes: data.likes || []
    };
    const created = await comments.create(doc);
    return populateUser(created);
  },
  async findByIdAndUpdate(id, update, options) {
    if (getIsConnected()) {
      return MongooseComment.findByIdAndUpdate(id, update, options).populate('user', 'name username avatar');
    }
    const updated = await comments.findByIdAndUpdate(id, update, options);
    if (!updated) return null;
    return populateUser(updated);
  },
  async findByIdAndDelete(id) {
    if (getIsConnected()) return MongooseComment.findByIdAndDelete(id);
    return comments.findByIdAndDelete(id);
  },
  async deleteMany(filter = {}) {
    if (getIsConnected()) return MongooseComment.deleteMany(filter);
    return comments.deleteMany(filter);
  }
};

module.exports = Comment;
