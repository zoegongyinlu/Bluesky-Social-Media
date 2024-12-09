import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import { throwError } from "../middlewares/errorHandler.js"; // Shared error utility

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    return await notification.save();
  } catch (error) {
    console.error("Error in createNotification:", error.message, { notificationData });
    throwError(500, "Failed to create notification");
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (userId) => {
  try {
    return await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate("from", "username profileImg");
  } catch (error) {
    console.error("Error in getUserNotifications:", error.message, { userId });
    throwError(500, "Failed to fetch user notifications");
  }
};

// Mark all notifications as read for a user
export const markNotificationsAsRead = async (userId) => {
  try {
    return await Notification.updateMany({ to: userId, read: false }, { read: true });
  } catch (error) {
    console.error("Error in markNotificationsAsRead:", error.message, { userId });
    throwError(500, "Failed to mark notifications as read");
  }
};

// Delete a specific notification by ID
export const deleteNotificationById = async (notificationId, userId) => {
  try {
    // Validate notificationId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throwError(400, "Invalid notification ID");
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throwError(404, "Notification not found");
    }

    if (notification.to.toString() !== userId) {
      throwError(403, "You are not authorized to delete this notification");
    }

    return await Notification.findByIdAndDelete(notificationId);
  } catch (error) {
    console.error("Error in deleteNotificationById:", error.message, { notificationId, userId });
    if (error.statusCode) throw error; // Re-throw custom errors
    throwError(500, "Failed to delete notification");
  }
};
