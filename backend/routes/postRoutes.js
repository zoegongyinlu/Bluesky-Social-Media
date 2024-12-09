import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", getAllPosts); // to add this for public too
router.get("/likes/:id", authMiddleware, getLikedPosts);
router.get("/following", authMiddleware, getFollowingPosts);
router.get("/user/:username", authMiddleware, getUserPosts);
router.post("/create", authMiddleware, createPost);
router.put("/like/:id", authMiddleware, likeUnlikePost);
router.patch("/comment/:id", authMiddleware, commentOnPost);
router.delete("/:id", authMiddleware, deletePost);


export default router;