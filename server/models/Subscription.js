const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { subscriptions, users } = require('../data/store');

const SubscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

SubscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

const MongooseSubscription = mongoose.model('Subscription', SubscriptionSchema);

async function populateSubData(subList) {
  const isArray = Array.isArray(subList);
  const list = isArray ? subList : [subList];
  if (!list[0]) return isArray ? [] : null;

  const populated = [];
  for (const s of list) {
    if (!s) continue;
    let channelDoc = null;
    if (s.channel && typeof s.channel === 'object' && s.channel.username) {
      channelDoc = s.channel;
    } else if (s.channel) {
      const u = await users.findById(s.channel);
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
      ...s,
      channel: channelDoc || { _id: s.channel, name: 'Channel', username: 'channel' }
    });
  }
  return isArray ? populated : populated[0];
}

const Subscription = {
  schema: SubscriptionSchema,
  async find(filter = {}) {
    if (getIsConnected()) {
      return MongooseSubscription.find(filter).populate('channel', 'name username avatar subscribersCount');
    }
    const raw = await subscriptions.find(filter);
    return populateSubData(raw);
  },
  async findOne(filter = {}) {
    if (getIsConnected()) return MongooseSubscription.findOne(filter);
    return subscriptions.findOne(filter);
  },
  async create(data) {
    if (getIsConnected()) return MongooseSubscription.create(data);
    return subscriptions.create(data);
  },
  async deleteOne(filter = {}) {
    if (getIsConnected()) return MongooseSubscription.deleteOne(filter);
    const existing = await subscriptions.findOne(filter);
    if (existing) {
      return subscriptions.findByIdAndDelete(existing._id);
    }
    return { deletedCount: 0 };
  },
  async countDocuments(filter = {}) {
    if (getIsConnected()) return MongooseSubscription.countDocuments(filter);
    return subscriptions.countDocuments(filter);
  },
  async deleteMany(filter = {}) {
    if (getIsConnected()) return MongooseSubscription.deleteMany(filter);
    return subscriptions.deleteMany(filter);
  }
};

module.exports = Subscription;
