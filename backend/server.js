/**
 * Express Server Application
 * 
 * This is the main server file for the Twitter Clone social media application.
 * It sets up the Express.js server with all necessary middleware, routes, and configurations
 * for handling HTTP requests, authentication, and database connections.
 * 
 * @file server.js
 * @description Main Express server application for Twitter Clone API
 * @author Twitter Clone Team
 * @version 1.0.0
 * @since 2024
 */

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js"; // Centralized error handler
import connectMongoDB from "./db/connectMongoDB.js"; // MongoDB connection utility

// Route imports
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

/**
 * Load environment variables from .env file
 * This must be called before accessing process.env variables
 */
dotenv.config({ path: './.env' });

/**
 * Initialize Express application
 * Creates the main Express app instance with all configurations
 * @type {express.Application}
 */
const app = express();

/**
 * Trust proxy setting
 * Required for proper handling of client IP addresses when behind a proxy
 * (e.g., when deployed on platforms like Render, Heroku)
 */
app.set('trust proxy', 1);

/**
 * Middleware Configuration
 * Sets up all necessary middleware for the Express application
 */

// Parse JSON request bodies
app.use(express.json());

// Parse cookies for JWT authentication
app.use(cookieParser());

/**
 * Request logging middleware
 * Logs all incoming requests for debugging and monitoring purposes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
app.use((req, res, next) => {
  console.log('Request received:', {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body
  });
  next();
});

/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Allows requests from specified origins with credentials support
 * @param {Object} options - CORS configuration options
 * @param {Array} options.origin - Allowed origins (production and development)
 * @param {Boolean} options.credentials - Allow credentials in CORS requests
 * @param {Array} options.methods - Allowed HTTP methods
 * @param {Array} options.allowedHeaders - Allowed request headers
 * @param {Array} options.exposedHeaders - Headers exposed to the client
 */
app.use(cors({
  origin: ['https://twitter-vi2l.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Content-Type', 'Set-Cookie']
}));

/**
 * Helmet middleware for security
 * Sets various HTTP headers to help protect the app from well-known web vulnerabilities
 */
app.use(helmet());

/**
 * Health Check Route
 * Simple endpoint to verify the server is running
 * @route GET /
 * @returns {String} API status message
 */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/**
 * API Routes Configuration
 * Mounts all API route handlers under their respective paths
 * All routes are prefixed with /api/v1 for versioning
 */
app.use("/api/v1/auth", authRoutes);           // Authentication routes (login, signup, logout)
app.use("/api/v1/posts", postRoutes);          // Post management routes (CRUD operations)
app.use("/api/v1/users", userRoutes);          // User management routes (profile, follow/unfollow)
app.use("/api/v1/notifications", notificationRoutes); // Notification routes (get, mark as read)

/**
 * Centralized Error Handling
 * This middleware catches all errors that occur in route handlers
 * and provides consistent error responses
 */
app.use(errorHandler);

/**
 * Database Connection
 * Establishes connection to MongoDB using the connection utility
 */
connectMongoDB();

/**
 * Server Startup
 * Starts the Express server on the specified port
 * @param {Number} PORT - Port number from environment variables or default 3001
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
