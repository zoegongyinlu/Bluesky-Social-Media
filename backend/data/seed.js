import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log("Existing data cleared");

    // Insert example users
    const users = [];
    for (let i = 1; i <= 15; i++) {
        users.push({
            fullName: `User ${i}`,
            username: `user${i}`,
            email: `user${i}@example.com`,
            password: `hashedpassword${i}`,
            bio: `Bio for user ${i}`,
            createdAt: new Date(`2023-10-${i < 10 ? "0" + i : i}T12:00:00.000Z`),
        });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users added`);

    // Assign followers and following
    for (let i = 0; i < createdUsers.length; i++) {
        const currentUser = createdUsers[i];

        // Add followers (users with smaller IDs)
        const followers = createdUsers
            .slice(0, Math.max(0, i - 5)) 
            .map((user) => user._id);

        // Add following (users with larger IDs)
        const following = createdUsers
            .slice(i + 1, i + 6) 
            .map((user) => user._id);

        currentUser.followers = followers;
        currentUser.following = following;
        await currentUser.save();
    }

    console.log("Followers and following relationships added");

    // Insert example posts
    const posts = [];
    for (let i = 1; i <= 20; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        posts.push({
            user: randomUser._id,
            text: `This is post ${i} by ${randomUser.username}`,
            img: i % 2 === 0 ? `https://example.com/image${i}.jpg` : null, 
            likes: createdUsers.slice(0, Math.min(i, 5)).map((user) => user._id), 
        });
    }
    const createdPosts = await Post.insertMany(posts);
    console.log(`${createdPosts.length} posts added`);

    // Update likedPosts for users
    for (const post of createdPosts) {
        for (const userId of post.likes) {
            await User.findByIdAndUpdate(userId, {
            $push: { likedPosts: post._id },
            });
        }
    }

    console.log("Liked posts added to user profiles");
    // Insert notifications
    const notifications = [];
    for (let i = 0; i < 30; i++) {
        const randomFromUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomToUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomPost = createdPosts[Math.floor(Math.random() * createdPosts.length)];

    // Ensure a user doesn't send a notification to themselves
    if (randomFromUser._id.toString() !== randomToUser._id.toString()) {
        const type = i % 3 === 0 ? "follow" : i % 2 === 0 ? "like" : "comment";

        notifications.push({
        from: randomFromUser._id,
        to: randomToUser._id,
        type: type,
        post: type === "like" || type === "comment" ? randomPost._id : undefined,
        read: i % 4 === 0, // Randomly mark some notifications as read
        });
    }
}
const createdNotifications = await Notification.insertMany(notifications);
console.log(`${createdNotifications.length} notifications added`);
mongoose.connection.close();
console.log("Seed data added successfully and connection closed");
} catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
    }
};

seedData();
