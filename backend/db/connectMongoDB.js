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

const connectMongoDB = async () => {
  try {
    // Validate that MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined. Please check your .env file or environment variables.");
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "***defined***" : "undefined");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectMongoDB;