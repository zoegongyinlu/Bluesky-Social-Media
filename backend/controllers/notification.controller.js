import * as notificationService from "../services/notificationService.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    await notificationService.markNotificationsAsRead(req.user._id);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotificationById(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    await notificationService.deleteNotificationById(id, req.user._id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const deleteNotifications = async (req, res, next) => {
  try {
    await notificationService.deleteAllNotifications(req.user._id);
    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    next(error);
  }
};
