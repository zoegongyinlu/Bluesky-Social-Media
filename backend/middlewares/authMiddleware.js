import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies?.jwt; // Use "jwt" for consistency with generateTokenAndSetCookie
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }

    // Fetch the user from the database (if needed)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ error: "Unauthorized: User not found" });

    // Attach user information to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token expiration and other verification errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // For other unexpected errors, pass to the error handler
    console.error("Error in authMiddleware:", error.message);
    next(error);
  }
};
