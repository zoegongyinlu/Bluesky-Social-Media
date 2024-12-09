import express from "express";
import { getUserProfile, updateUser, followUnfollowUser} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:username", authMiddleware, getUserProfile);
router.post("/follow/:id", authMiddleware, followUnfollowUser);
router.put("/update", authMiddleware, updateUser); 


export default router;
