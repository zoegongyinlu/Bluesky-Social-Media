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
        await Notification.deleteMany({});

        console.log("Existing data cleared");

        // Optimized user data - reduced for better performance
        const userData = [
            {
                fullName: "Alex Johnson",
                username: "alexj",
                email: "alex.johnson@email.com",
                password: "$2b$10$hashedpassword1",
                bio: "Software engineer passionate about web development and open source. Coffee enthusiast ☕",
                profileImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=200&fit=crop"
            },
            {
                fullName: "Sarah Chen",
                username: "sarahchen",
                email: "sarah.chen@email.com",
                password: "$2b$10$hashedpassword2",
                bio: "UX Designer | Art lover | Travel blogger | Living life one adventure at a time ✈️",
                profileImg: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop"
            },
            {
                fullName: "Marcus Rodriguez",
                username: "marcusr",
                email: "marcus.rodriguez@email.com",
                password: "$2b$10$hashedpassword3",
                bio: "Photographer | Nature enthusiast | Dog dad 🐕 | Capturing moments that matter",
                profileImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop"
            },
            {
                fullName: "Emma Thompson",
                username: "emmathompson",
                email: "emma.thompson@email.com",
                password: "$2b$10$hashedpassword4",
                bio: "Writer | Book lover | Tea connoisseur | Sharing thoughts and stories 📚",
                profileImg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=200&fit=crop"
            },
            {
                fullName: "David Kim",
                username: "davidkim",
                email: "david.kim@email.com",
                password: "$2b$10$hashedpassword5",
                bio: "Data Scientist | Machine Learning enthusiast | Chess player ♟️ | Always learning",
                profileImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=200&fit=crop"
            },
            {
                fullName: "Lisa Wang",
                username: "lisawang",
                email: "lisa.wang@email.com",
                password: "$2b$10$hashedpassword6",
                bio: "Product Manager | Fitness enthusiast | Foodie | Building products that matter 💪",
                profileImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=200&fit=crop"
            },
            {
                fullName: "James Wilson",
                username: "jameswilson",
                email: "james.wilson@email.com",
                password: "$2b$10$hashedpassword7",
                bio: "Musician | Guitarist | Songwriter | Spreading good vibes through music 🎸",
                profileImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=200&fit=crop"
            },
            {
                fullName: "Maya Patel",
                username: "mayapatel",
                email: "maya.patel@email.com",
                password: "$2b$10$hashedpassword8",
                bio: "Graphic Designer | Illustrator | Yoga instructor | Creating beautiful things 🎨",
                profileImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
                coverImg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop"
            }
        ];

        const createdUsers = await User.insertMany(userData);
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

        // Realistic post content
        const postContent = [
            "Just finished reading an amazing book about machine learning! The future of AI is so exciting 🤖 #AI #MachineLearning #Tech",
            "Beautiful sunset from my hike today. Nature never fails to amaze me 🌅 #Nature #Photography #Hiking",
            "Coffee and code - the perfect combination for a productive morning ☕💻 #Programming #Coffee #Productivity",
            "Had an incredible time at the art gallery today. Art has such power to move and inspire 🎨 #Art #Inspiration #Culture",
            "Just launched my new project! Excited to see where this journey takes us 🚀 #Startup #Innovation #Tech",
            "Morning workout complete! Nothing beats that post-exercise endorphin rush 💪 #Fitness #Health #Motivation",
            "Cooking experiment tonight - trying a new recipe from my travels. The kitchen smells amazing! 👨‍🍳 #Cooking #Food #Travel",
            "Music is the universal language. Just finished recording a new track 🎵 #Music #Creativity #Art",
            "Reading session with my little ones. Books open up whole new worlds 📚 #Parenting #Books #Family",
            "Design thinking workshop was incredible! Love collaborating with creative minds 🎨 #Design #UX #Collaboration",
            "Gaming marathon weekend! Who else is excited for the new releases? 🎮 #Gaming #Entertainment #Weekend",
            "Yoga session at sunrise. Finding peace and balance in the chaos 🧘‍♀️ #Yoga #Mindfulness #Wellness",
            "Data visualization project coming together nicely. Numbers tell such interesting stories 📊 #DataScience #Analytics",
            "Food truck festival was amazing! Discovered some incredible flavors from around the world 🌮 #Food #Culture #Travel",
            "Art therapy session today. Sometimes the best medicine is creativity 🎨 #ArtTherapy #MentalHealth #Healing",
            "Streaming session was so much fun! Thanks to everyone who joined the chat 🎮 #Streaming #Gaming #Community",
            "Marathon training update: 15 miles down! The finish line is getting closer 🏃‍♀️ #Running #Marathon #Fitness",
            "Chess tournament this weekend. Strategy and patience - life lessons from the board ♟️ #Chess #Strategy #MindGames",
            "Photography walk in the city. Every corner has a story to tell 📸 #Photography #Urban #Storytelling",
            "Product launch day! Months of hard work finally paying off 🎉 #ProductLaunch #Success #Teamwork",
            "Meditation and mindfulness practice. Sometimes the best action is stillness 🧘‍♂️ #Meditation #Mindfulness #Peace",
            "Cooking class with friends. Food brings people together in the best way 👨‍🍳 #Cooking #Friends #Community",
            "Tech conference was mind-blowing! The innovations happening right now are incredible 🤯 #Tech #Innovation #Conference",
            "Art exhibition opening night. So proud of all the talented artists featured 🎨 #Art #Exhibition #Culture",
            "Weekend hiking adventure. The mountains always remind me how small we are in this vast world 🏔️ #Hiking #Nature #Adventure",
            "Music production session. Creating something from nothing is pure magic 🎵 #Music #Production #Creativity",
            "Health checkup went great! Prevention is always better than cure 👨‍⚕️ #Health #Prevention #Wellness",
            "Book club discussion was fascinating. Different perspectives enrich our understanding 📖 #Books #Discussion #Learning",
            "Fitness challenge completed! Consistency is key to achieving any goal 💪 #Fitness #Goals #Consistency",
            "Travel planning for next adventure. The world is too big to stay in one place ✈️ #Travel #Adventure #Wanderlust"
        ];

        const imageUrls = [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
            "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=600&h=400&fit=crop"
        ];

        // Insert optimized posts - reduced for better performance
        const posts = [];
        for (let i = 0; i < 20; i++) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomContent = postContent[Math.floor(Math.random() * postContent.length)];
            const shouldHaveImage = Math.random() > 0.7; // 30% chance of having an image
            const randomImage = shouldHaveImage ? imageUrls[Math.floor(Math.random() * imageUrls.length)] : null;
            
            // Generate realistic likes (some posts more popular than others)
            const likeCount = Math.floor(Math.random() * 8) + 1; // 1-8 likes (reduced)
            const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
            const likes = shuffledUsers.slice(0, likeCount).map(user => user._id);

            posts.push({
                user: randomUser._id,
                text: randomContent,
                img: randomImage,
                likes: likes,
                createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Random date within last 14 days
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

        // Add comments to posts
        const commentTexts = [
            "Amazing post! Thanks for sharing! 😊",
            "This is so inspiring! Keep it up! 👏",
            "I totally agree with this! 💯",
            "Beautiful! This made my day 🌟",
            "Great perspective on this topic! 🤔",
            "Love this! Can't wait to see more! ❤️",
            "This is exactly what I needed to hear today! 🙏",
            "Incredible work! You're so talented! 🎨",
            "Thanks for the inspiration! ✨",
            "This is fantastic! Well done! 🎉",
            "I had a similar experience! Great to see others relate! 🤝",
            "This is so well written! 📝",
            "Amazing photography! 📸",
            "This made me smile! 😄",
            "Great advice! Will definitely try this! 💡",
            "So true! This resonates with me! 🎯",
            "Beautiful words! Thank you for sharing! 🙌",
            "This is incredible! Keep creating! 🚀",
            "Love your energy! Positive vibes! ✌️",
            "This is exactly what I was looking for! 🎯"
        ];

        // Add optimized comments - reduced for better performance
        for (let i = 0; i < 30; i++) {
            const randomPost = createdPosts[Math.floor(Math.random() * createdPosts.length)];
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)];

            // Add comment to post
            await Post.findByIdAndUpdate(randomPost._id, {
                $push: {
                    comments: {
                        text: randomComment,
                        user: randomUser._id
                    }
                }
            });
        }

        console.log("Comments added to posts");

        // Create optimized notifications - reduced for better performance
        const notifications = [];
        
        // Follow notifications
        for (let i = 0; i < 12; i++) {
            const randomFromUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const randomToUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            
            if (randomFromUser._id.toString() !== randomToUser._id.toString()) {
                notifications.push({
                    from: randomFromUser._id,
                    to: randomToUser._id,
                    type: "follow",
                    read: Math.random() > 0.3, // 70% chance of being read
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
                });
            }
        }

        // Like notifications
        for (let i = 0; i < 18; i++) {
            const randomPost = createdPosts[Math.floor(Math.random() * createdPosts.length)];
            const randomFromUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const postOwner = randomPost.user;
            
            if (randomFromUser._id.toString() !== postOwner.toString()) {
                notifications.push({
                    from: randomFromUser._id,
                    to: postOwner,
                    type: "like",
                    post: randomPost._id,
                    read: Math.random() > 0.4, // 60% chance of being read
                    createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) // Last 3 days
                });
            }
        }

        // Comment notifications
        for (let i = 0; i < 10; i++) {
            const randomPost = createdPosts[Math.floor(Math.random() * createdPosts.length)];
            const randomFromUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const postOwner = randomPost.user;
            
            if (randomFromUser._id.toString() !== postOwner.toString()) {
                notifications.push({
                    from: randomFromUser._id,
                    to: postOwner,
                    type: "comment",
                    post: randomPost._id,
                    read: Math.random() > 0.5, // 50% chance of being read
                    createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000) // Last 2 days
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
