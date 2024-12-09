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

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Parse cookies for JWT


// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow requests from client
app.use((req, res, next) => {
  console.log('Request received:', {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body
  });
  next();
});
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'https://yifeichenyinlugonglingxiaoguoproject3.onrender.com', // Fallback included
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"]
}));
app.use(helmet()); // Secure HTTP headers

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Centralized error handling
app.use(errorHandler);

// Connect to MongoDB
connectMongoDB();

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
