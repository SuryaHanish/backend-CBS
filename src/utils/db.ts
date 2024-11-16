import mongoose from 'mongoose';

const connectDB = async () => {
  let attempts = 0;
  const maxRetries = 5;
  while (attempts < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string, {
        connectTimeoutMS: 30000,  // Timeout for initial connection (30 seconds)
        socketTimeoutMS: 45000,   // Timeout for socket read (45 seconds)
        retryWrites: true,        // Enable retryable writes
      });
      console.log('MongoDB connected');
      break; // Exit the loop if successful
    } catch (error) {
      attempts++;
      console.error(`MongoDB connection attempt ${attempts} failed:`, error);
      if (attempts >= maxRetries) {
        console.error('Max retries reached, exiting...');
        process.exit(1);
      }
      console.log('Retrying in 5 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
};

export default connectDB;
