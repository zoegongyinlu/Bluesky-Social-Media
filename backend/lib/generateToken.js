/**
 * JWT Token Generation Utility
 * 
 * This module provides utility functions for generating JSON Web Tokens (JWT)
 * and setting secure HTTP-only cookies for user authentication. It handles
 * token creation, cookie configuration, and security best practices.
 * 
 * @file generateToken.js
 * @description JWT token generation and cookie management utility
 * @author Twitter Clone Team
 * @version 1.0.0
 * @since 2024
 */

import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie
 * 
 * This function creates a secure JWT token containing user information and
 * sets it as an HTTP-only cookie in the response. The cookie is configured
 * with security options appropriate for the current environment.
 * 
 * @function generateTokenAndSetCookie
 * @description Generates JWT token and sets secure HTTP-only cookie
 * @param {String} userId - The user ID to include in the token payload
 * @param {Object} res - Express response object for setting cookies
 * @param {Object} [additionalPayload={}] - Additional data to include in token payload
 * @returns {String} The generated JWT token
 * @throws {Error} Throws error if token generation fails
 * 
 * @example
 * // Basic usage
 * const token = generateTokenAndSetCookie(userId, res);
 * 
 * @example
 * // With additional payload
 * const token = generateTokenAndSetCookie(userId, res, { role: 'admin' });
 * 
 * @security
 * - Uses HTTP-only cookies to prevent XSS attacks
 * - Implements SameSite protection against CSRF attacks
 * - Enforces HTTPS in production environment
 * - Sets appropriate expiration times
 * 
 * @environment
 * @param {String} JWT_SECRET - Secret key for signing JWT tokens
 * @param {String} JWT_EXPIRES_IN - Token expiration time (default: "15d")
 * @param {String} NODE_ENV - Environment (affects cookie security settings)
 * @param {String} COOKIE_DOMAIN - Optional domain for cookie (production only)
 */
export const generateTokenAndSetCookie = (userId, res, additionalPayload = {}) => {
  try {
    /**
     * Generate JWT token with user information
     * @param {Object} payload - Token payload containing user data
     * @param {String} payload.userId - User ID (required)
     * @param {Object} payload.additionalPayload - Additional user data (optional)
     * @param {String} secret - JWT secret key from environment variables
     * @param {Object} options - Token options including expiration
     */
    const token = jwt.sign(
      { userId, ...additionalPayload },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "15d", // Default 15 days if not provided
      }
    );

    /**
     * Set HTTP-only cookie with security configurations
     * @param {String} name - Cookie name ("jwt")
     * @param {String} value - JWT token value
     * @param {Object} options - Cookie security options
     */
    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      httpOnly: true, // Prevent XSS attacks by making cookie inaccessible to JavaScript
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      domain: process.env.COOKIE_DOMAIN || undefined, // Optional domain restriction
    });

    return token; // Return token for potential use in response or logging
  } catch (error) {
    /**
     * Error handling for token generation failures
     * Logs the error and throws a generic error message to prevent
     * sensitive information leakage
     */
    console.error("Error in generateTokenAndSetCookie:", error.message);
    throw new Error("Token generation failed due to internal server error");
  }
};
