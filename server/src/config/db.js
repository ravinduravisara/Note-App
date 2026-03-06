const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Check your MONGO_URI in .env and ensure your IP is whitelisted in Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;
