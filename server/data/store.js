const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data_storage');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(dataDir, `${name}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`Error loading collection ${this.name}:`, e.message);
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error saving collection ${this.name}:`, e.message);
    }
  }

  async find(filter = {}) {
    let results = this.data.filter(item => this.matchFilter(item, filter));
    return results.map(item => ({ ...item }));
  }

  async findOne(filter = {}) {
    const item = this.data.find(item => this.matchFilter(item, filter));
    return item ? { ...item } : null;
  }

  async findById(id) {
    const strId = String(id);
    const item = this.data.find(item => String(item._id) === strId);
    return item ? { ...item } : null;
  }

  async create(doc) {
    const _id = doc._id || (Date.now().toString(36) + Math.random().toString(36).substring(2, 9));
    const now = new Date();
    const newDoc = {
      ...doc,
      _id,
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || now
    };
    this.data.unshift(newDoc);
    this.save();
    return { ...newDoc };
  }

  async insertMany(docs) {
    const results = [];
    for (const doc of docs) {
      results.push(await this.create(doc));
    }
    return results;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const strId = String(id);
    const index = this.data.findIndex(item => String(item._id) === strId);
    if (index === -1) return null;

    let target = { ...this.data[index] };
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        target[k] = (target[k] || 0) + v;
      }
    }
    if (update.$addToSet) {
      for (const [k, v] of Object.entries(update.$addToSet)) {
        target[k] = target[k] || [];
        const strVal = String(v);
        if (!target[k].map(String).includes(strVal)) {
          target[k].push(v);
        }
      }
    }
    if (update.$pull) {
      for (const [k, v] of Object.entries(update.$pull)) {
        if (Array.isArray(target[k])) {
          const strVal = String(v);
          target[k] = target[k].filter(item => String(item) !== strVal);
        }
      }
    }
    if (update.$push) {
      for (const [k, v] of Object.entries(update.$push)) {
        target[k] = target[k] || [];
        target[k].push(v);
      }
    }
    if (update.$set) {
      Object.assign(target, update.$set);
    }
    // direct fields
    for (const [k, v] of Object.entries(update)) {
      if (!k.startsWith('$')) {
        target[k] = v;
      }
    }
    target.updatedAt = new Date();
    this.data[index] = target;
    this.save();
    return { ...target };
  }

  async findByIdAndDelete(id) {
    const strId = String(id);
    const index = this.data.findIndex(item => String(item._id) === strId);
    if (index === -1) return null;
    const removed = this.data.splice(index, 1)[0];
    this.save();
    return removed;
  }

  async deleteMany(filter = {}) {
    const initialLen = this.data.length;
    this.data = this.data.filter(item => !this.matchFilter(item, filter));
    this.save();
    return { deletedCount: initialLen - this.data.length };
  }

  async countDocuments(filter = {}) {
    return this.data.filter(item => this.matchFilter(item, filter)).length;
  }

  matchFilter(item, filter) {
    for (const [key, val] of Object.entries(filter)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchesAny = val.some(subFilter => this.matchFilter(item, subFilter));
        if (!matchesAny) return false;
        continue;
      }
      if (key === '$and' && Array.isArray(val)) {
        const matchesAll = val.every(subFilter => this.matchFilter(item, subFilter));
        if (!matchesAll) return false;
        continue;
      }

      const itemVal = item[key];
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
        if (val.$regex) {
          const reg = new RegExp(val.$regex, val.$options || 'i');
          if (!reg.test(String(itemVal || ''))) return false;
        } else if (val.$in) {
          const strList = val.$in.map(String);
          if (Array.isArray(itemVal)) {
            if (!itemVal.some(iv => strList.includes(String(iv)))) return false;
          } else {
            if (!strList.includes(String(itemVal))) return false;
          }
        } else if (val.$nin) {
          const strList = val.$nin.map(String);
          if (strList.includes(String(itemVal))) return false;
        } else if (val.$ne !== undefined) {
          if (String(itemVal) === String(val.$ne)) return false;
        }
      } else if (val instanceof RegExp) {
        if (!val.test(String(itemVal || ''))) return false;
      } else if (Array.isArray(itemVal)) {
        if (!itemVal.map(String).includes(String(val))) return false;
      } else {
        if (String(itemVal) !== String(val)) return false;
      }
    }
    return true;
  }
}

module.exports = {
  users: new Collection('users'),
  videos: new Collection('videos'),
  comments: new Collection('comments'),
  subscriptions: new Collection('subscriptions')
};
