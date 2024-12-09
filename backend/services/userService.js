import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { throwError } from "../middlewares/errorHandler.js"; // Centralized error utility

// Utility: Delete a Cloudinary image
const deleteCloudinaryImage = async (imageUrl) => {
  if (imageUrl) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }
};

// Get User Profile by Username
export const getUserProfile = async (username) => {
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) throwError(404, "User not found");
    return user;
  } catch (error) {
    console.error("Error in getUserProfile:", error.message, { username });
    throwError(500, "Failed to fetch user profile");
  }
};

// Follow or Unfollow a User
export const followUnfollowUser = async (currentUserId, targetUserId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      throwError(400, "Invalid user ID");
    }

    if (currentUserId === targetUserId) {
      throwError(400, "You cannot follow/unfollow yourself");
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      throwError(404, "User not found");
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      return { message: "User unfollowed successfully", userId: targetUserId };
    } else {
      // Follow the user
      await User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } });

      // Create a notification
      const notification = new Notification({
        type: "follow",
        from: currentUserId,
        to: targetUserId,
      });
      await notification.save();

      return { message: "User followed successfully", userId: targetUserId };
    }
  } catch (error) {
    console.error("Error in followUnfollowUser:", error.message, { currentUserId, targetUserId });
    throwError(500, "Failed to follow/unfollow user");
  }
};

// Get Suggested Users
export const getSuggestedUsers = async (userId) => {
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) throwError(404, "User not found");

    const suggestions = await User.aggregate([
      { $match: { _id: { $ne: userId, $nin: currentUser.following } } },
      { $sample: { size: 10 } },
      { $project: { password: 0 } },
    ]);

    return suggestions;
  } catch (error) {
    console.error("Error in getSuggestedUsers:", error.message, { userId });
    throwError(500, "Failed to fetch suggested users");
  }
};

// Update User Profile
export const updateUser = async (userId, updates) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link, profileImg, coverImg } = updates;

  try {
    const user = await User.findById(userId);
    if (!user) throwError(404, "User not found");

    // Handle Password Update
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        throwError(400, "Both current and new passwords are required");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) throwError(400, "Current password is incorrect");

      if (newPassword.length < 6) {
        throwError(400, "New password must be at least 6 characters long");
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle Profile Image Update
    if (profileImg) {
      await deleteCloudinaryImage(user.profileImg);
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploadedResponse.secure_url;
    }

    // Handle Cover Image Update
    if (coverImg) {
      await deleteCloudinaryImage(user.coverImg);
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      user.coverImg = uploadedResponse.secure_url;
    }

    // Update Other Fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return userWithoutPassword;
  } catch (error) {
    console.error("Error in updateUser:", error.message, { userId, updates });
    throwError(500, "Failed to update user profile");
  }
};
