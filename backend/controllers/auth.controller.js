import * as authService from "../services/authService.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import { signupSchema, loginSchema } from "../validators/userValidators.js";
import { throwError } from "../middlewares/errorHandler.js";

export const signup = async (req, res, next) => {
  try {
    // Validate input
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message),
      });
    }

    const { fullName, username, email, password } = req.body;
    const { user, token } = await authService.signup({ fullName, username, email, password });

    // Send token in a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    
    res.setHeader('Content-Type', 'application/json');//adding this for debugging
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message),
      });
    }

    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);

    // Send token in a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      path : '/'
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = authService.logout(res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throwError(401, "No token provided");

    const decoded = authService.validateToken(token);
    req.user = await authService.getUserById(decoded.userId);
    next();
  } catch (error) {
    next(error);
  }
};
