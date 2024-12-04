import mongoose from 'mongoose';

// MongoDB URI from environment variable
const MONGO_URI = process.env.MONGODB_URI!;

// Database connection function
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

export default connectToDatabase;



