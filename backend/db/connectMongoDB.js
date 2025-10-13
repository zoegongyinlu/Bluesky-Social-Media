/**
 * MongoDB Connection Utility
 * 
 * This module provides a utility function to establish and manage the connection
 * to the MongoDB database. It handles connection configuration, error handling,
 * and graceful shutdown procedures.
 * 
 * @file connectMongoDB.js
 * @description MongoDB connection utility for the Twitter Clone application
 * @author Twitter Clone Team
 * @version 1.0.0
 * @since 2024
 */

import mongoose from "mongoose";

/**
 * Connects to MongoDB database using Mongoose
 * 
 * This function establishes a connection to the MongoDB database using the connection
 * string provided in the environment variables. It includes proper error handling
 * and connection options for optimal performance and reliability.
 * 
 * @async
 * @function connectMongoDB
 * @description Establishes connection to MongoDB database
 * @returns {Promise<void>} Promise that resolves when connection is established
 * @throws {Error} Throws error if connection fails and exits process
 * 
 * @example
 * // Usage in server.js
 * import connectMongoDB from "./db/connectMongoDB.js";
 * connectMongoDB();
 * 
 * @environment
 * @param {String} MONGO_URI - MongoDB connection string from environment variables
 * @example "mongodb://localhost:27017/twitter-clone" (local)
 * @example "mongodb+srv://username:password@cluster.mongodb.net/twitter-clone" (Atlas)
 */
const connectMongoDB = async () => {
  try {
    /**
     * Establish MongoDB connection with optimized options
     * @param {String} process.env.MONGO_URI - Connection string from environment
     * @param {Object} options - Connection options for optimal performance
     * @param {Boolean} options.useNewUrlParser - Use new URL parser (deprecated but kept for compatibility)
     * @param {Boolean} options.useUnifiedTopology - Use new server discovery and monitoring engine
     */
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,        // Use new URL parser (legacy option)
      useUnifiedTopology: true,     // Use new server discovery and monitoring engine
    });
    
    console.log("MongoDB connected successfully");
    
    /**
     * Connection event listeners for monitoring
     * These listeners help track the connection state and handle various scenarios
     */
    
    // Connection successful
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });
    
    // Connection error
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    
    // Connection disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });
    
    // Graceful shutdown on process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    /**
     * Error handling for connection failures
     * Logs the error and exits the process to prevent the application
     * from running without a database connection
     */
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit with error code 1
  }
};

export default connectMongoDB;
