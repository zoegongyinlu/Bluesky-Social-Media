import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { throwError } from "../middlewares/errorHandler.js"; // Utility for consistent error handling

// Utility: Delete an image from Cloudinary
const deleteCloudinaryImage = async (imageUrl) => {
  if (imageUrl) {
    const imgId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }
};

// Create a new post
export const createPost = async (userId, postData) => {
  try {
    const { text, img } = postData;

    let imageUrl = null;
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      imageUrl = uploadedResponse.secure_url;
    }

    const newPost = new Post({ user: userId, text, img: imageUrl });
    return await newPost.save();
  } catch (error) {
    console.error("Error in createPost:", error.message);
    throwError(500, "Failed to create post");
  }
};

// Delete a post by ID
export const deletePostById = async (postId, userId) => {
  try {
    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throwError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);
    if (!post) throwError(404, "Post not found");

    if (post.user.toString() !== userId) {
      throwError(403, "Unauthorized to delete this post");
    }

    // Delete associated image if exists
    await deleteCloudinaryImage(post.img);

    return await Post.findByIdAndDelete(postId);
  } catch (error) {
    console.error("Error in deletePostById:", error.message);
    throwError(error.statusCode || 500, error.message || "Failed to delete post");
  }
};

// Add a comment to a post
export const commentOnPost = async (postId, userId, commentText) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throwError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);
    if (!post) throwError(404, "Post not found");

    const comment = { user: userId, text: commentText };
    post.comments.push(comment);
    await post.save();

    return post.comments;
  } catch (error) {
    console.error("Error in commentOnPost:", error.message);
    throwError(500, "Failed to add comment");
  }
};

// Like/Unlike a post
export const likeUnlikePost = async (postId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throwError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId);
    if (!post) throwError(404, "Post not found");

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    }

    await post.save();
    return post.likes;
  } catch (error) {
    console.error("Error in likeUnlikePost:", error.message);
    throwError(500, "Failed to like/unlike post");
  }
};

// Fetch all posts
export const getAllPosts = async () => {
  try {
    return await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
  } catch (error) {
    console.error("Error in getAllPosts:", error.message);
    throwError(500, "Failed to fetch posts");
  }
};

// Fetch user's liked posts
export const getLikedPosts = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throwError(404, "User not found");

    return await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", "-password")
      .populate("comments.user", "-password");
  } catch (error) {
    console.error("Error in getLikedPosts:", error.message);
    throwError(500, "Failed to fetch liked posts");
  }
};

// Fetch posts of followed users
export const getFollowingPosts = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throwError(404, "User not found");

    return await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
  } catch (error) {
    console.error("Error in getFollowingPosts:", error.message);
    throwError(500, "Failed to fetch following posts");
  }
};

// Fetch posts by username
export const getUserPosts = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) throwError(404, "User not found");

    return await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
  } catch (error) {
    console.error("Error in getUserPosts:", error.message);
    throwError(500, "Failed to fetch user's posts");
  }
};
