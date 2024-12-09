import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res, additionalPayload = {}) => {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId, ...additionalPayload },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "15d", // Default 15 days if not provided
      }
    );

    // Set the cookie with secure options
    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      httpOnly: true, // Prevent XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      domain: process.env.COOKIE_DOMAIN || undefined, // Optional domain
    });

    return token; // Optionally return the token for other uses
  } catch (error) {
    console.error("Error in generateTokenAndSetCookie:", error.message);
    throw new Error("Failed to generate token");
    throw new Error("Token generation failed due to internal server error");

  }
};
