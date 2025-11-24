import mongoose from 'mongoose';

// ========================================
// MONGODB CONNECTION
// ========================================
async function connectMongo() {
  try {
    // Connection options for better performance and reliability
    const options = {
      maxPoolSize: 10, // Maximum number of connections in pool
      minPoolSize: 2, // Minimum number of connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Event handlers (register BEFORE connecting)
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    });

    // Connect to MongoDB
    await mongoose.connect(process.env.DB, options);

    // Verify connection
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB connection state: Ready');
    }
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);

    // Exit process if connection fails (let PM2/Docker restart it)
    process.exit(1);
  }
}

export default connectMongo;
