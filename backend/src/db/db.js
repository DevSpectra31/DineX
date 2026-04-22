const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName:"DineX",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
