const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-proctor';
  try {
    await mongoose.connect(mongoUri);
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(`MongoDB connected: ${mongoUri}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Mongo connection error', error);
    process.exit(1);
  }
};

module.exports = connectDB;
