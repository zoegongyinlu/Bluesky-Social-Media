import mongoose from "mongoose";
import * as postService from "../services/postService.js";
import { postValidationSchema } from "../validators/userValidators.js";

export const createPost = async (req, res, next) => {
  try {
    // Validate input
    const { error } = postValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message),
      });
    }

    const newPost = await postService.createPost(req.user._id, req.body);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
    try {
      const { id: postId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
  
      const result = await postService.deletePostById(postId, req.user._id);
      res.status(200).json({ message: "Post deleted successfully", post: result });
    } catch (error) {
      next(error);
    }
  };
  
  // Comment on a post
  export const commentOnPost = async (req, res, next) => {
    try {
      const { id: postId } = req.params;
      const { text: commentText } = req.body;
  
      if (!commentText) {
        return res.status(400).json({ error: "Comment text is required" });
      }
  
      const comments = await postService.commentOnPost(postId, req.user._id, commentText);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };
  
  // Like or unlike a post
  export const likeUnlikePost = async (req, res, next) => {
    try {
      const { id: postId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid post ID" });
      }
  
      const likes = await postService.likeUnlikePost(postId, req.user._id);
      res.status(200).json({ likes });
    } catch (error) {
      next(error);
    }
  };
  
  // Fetch all posts
  export const getAllPosts = async (req, res, next) => {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };
  
  // Fetch liked posts for a user
  export const getLikedPosts = async (req, res, next) => {
    try {
      const { id: userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      const likedPosts = await postService.getLikedPosts(userId);
      res.status(200).json(likedPosts);
    } catch (error) {
      next(error);
    }
  };
  
  // Fetch posts from followed users
  export const getFollowingPosts = async (req, res, next) => {
    try {
      const posts = await postService.getFollowingPosts(req.user._id);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };
  
  // Fetch posts by a specific username
  export const getUserPosts = async (req, res, next) => {
    try {
      const { username } = req.params;
  
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
  
      const posts = await postService.getUserPosts(username);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };
