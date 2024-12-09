import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { throwError } from "../middlewares/errorHandler.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15d",
  });
};

// Signup a new user
export const signup = async ({ fullName, username, email, password }) => {
  try {
    // Check for existing username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throwError(400, "Username or email already taken");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a token
    const token = generateToken(newUser._id);

    return { user: newUser, token };
  } catch (error) {
    console.error("Error in signup:", error.message);
    throwError(500, "Failed to create user");
  }
};

// Login an existing user
export const login = async (username, password) => {
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) throwError(400, "Invalid username or password");

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throwError(400, "Invalid username or password");

    // Generate a token
    const token = generateToken(user._id);

    return { user, token };
  } catch (error) {
    console.error("Error in login:", error.message);
    throwError(500, "Failed to login");
  }
};

// Logout the user
export const logout = (res) => {
  try {
    res.clearCookie("jwt");
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Error in logout:", error.message);
    throwError(500, "Failed to logout");
  }
};

// Validate a JWT token
export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throwError(401, "Invalid or expired token");
  }
};
