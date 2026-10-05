const mongoose = require('mongoose');
const memoryStore = require('../data/memoryStore');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/CareSetu';
  
  try {
    // Attempt MongoDB connection with 3-second timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoURI}`);
    memoryStore.setMongoStatus(true);
  } catch (error) {
    console.warn(`⚠️ MongoDB not reachable at ${mongoURI} (${error.message}).`);
    console.log(`🚀 CareSetu has smoothly initialized the High-Performance In-Memory Data Engine with pre-seeded demo records!`);
    console.log(`📌 All APIs, Authentication, Reports, Timeline & Medicine Management will function seamlessly.`);
    memoryStore.setMongoStatus(false);
  }
};

module.exports = connectDB;
