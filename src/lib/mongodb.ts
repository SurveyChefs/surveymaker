import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI!;

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

export default connectToDatabase;



