const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const { users } = require('../data/store');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: 50
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  banner: {
    type: String,
    default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  description: {
    type: String,
    default: 'Welcome to my channel!'
  },
  subscribersCount: {
    type: Number,
    default: 0
  },
  subscribedChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  history: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Mongoose hooks
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.model('User', UserSchema);

// Unified Model interface
const User = {
  schema: UserSchema,
  async find(filter = {}) {
    if (getIsConnected()) return MongooseUser.find(filter);
    return users.find(filter);
  },
  async findOne(filter = {}) {
    if (getIsConnected()) return MongooseUser.findOne(filter).select('+password');
    const u = await users.findOne(filter);
    return u;
  },
  async findById(id) {
    if (getIsConnected()) return MongooseUser.findById(id).select('+password');
    return users.findById(id);
  },
  async create(data) {
    if (getIsConnected()) {
      return MongooseUser.create(data);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const doc = {
      ...data,
      password: hashedPassword,
      subscribersCount: data.subscribersCount || 0,
      subscribedChannels: data.subscribedChannels || [],
      likedVideos: data.likedVideos || [],
      history: data.history || [],
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      banner: data.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description: data.description || 'Welcome to my channel!'
    };
    return users.create(doc);
  },
  async findByIdAndUpdate(id, update, options) {
    if (getIsConnected()) return MongooseUser.findByIdAndUpdate(id, update, options);
    return users.findByIdAndUpdate(id, update, options);
  },
  async countDocuments(filter = {}) {
    if (getIsConnected()) return MongooseUser.countDocuments(filter);
    return users.countDocuments(filter);
  },
  async deleteMany(filter = {}) {
    if (getIsConnected()) return MongooseUser.deleteMany(filter);
    return users.deleteMany(filter);
  },
  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
};

module.exports = User;
