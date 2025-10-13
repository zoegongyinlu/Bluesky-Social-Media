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
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectMongoDB;