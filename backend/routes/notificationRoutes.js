import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.delete("/:id", authMiddleware, deleteNotification);
router.delete("/", authMiddleware, deleteNotifications); 


export default router;
