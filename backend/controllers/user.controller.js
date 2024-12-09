import * as userService from "../services/userService.js";
import { updateUserSchema } from "../validators/userValidators.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.params.username);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const followUnfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await userService.followUnfollowUser(req.user._id, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Validate input
    const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message),
      });
    }

    const updatedUser = await userService.updateUser(req.user._id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
