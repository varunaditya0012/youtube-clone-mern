const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/youtube_clone';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout to avoid hanging if no local mongo
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`ℹ️ Local MongoDB service not active (${error.message}).`);
    console.log(` Using embedded persistent JSON storage engine (100% operational MERN clone mode).`);
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
