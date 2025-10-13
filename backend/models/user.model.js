import mongoose from "mongoose";

/**
 * User Model Schema
 * 
 * This schema defines the structure and validation rules for user documents in the MongoDB database.
 * It represents a user account in the social media platform with all necessary fields for
 * authentication, profile management, and social interactions.
 * 
 * @class User
 * @description Mongoose model for user accounts with social media features
 * @author Twitter Clone Team
 * @version 1.0.0
 */
const userSchema = new mongoose.Schema({
    /**
     * Username field - unique identifier for the user
     * @type {String}
     * @required true
     * @unique true
     * @description The user's chosen username, must be unique across the platform
     * @example "john_doe", "sarah_chen", "alex_dev"
     */
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    /**
     * Full name field - user's real name
     * @type {String}
     * @required true
     * @description The user's full legal name or display name
     * @example "John Doe", "Sarah Chen", "Alex Johnson"
     */
    fullName: { 
        type: String, 
        required: true 
    },
    
    /**
     * Password field - hashed user password
     * @type {String}
     * @required true
     * @description The user's password, should be hashed using bcrypt before storage
     * @security This field should never be returned in API responses
     */
    password: { 
        type: String, 
        required: true 
    },
    
    /**
     * Email field - user's email address
     * @type {String}
     * @required true
     * @unique true
     * @description The user's email address, used for account verification and notifications
     * @example "john@example.com", "sarah.chen@email.com"
     */
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    
    /**
     * Followers array - users who follow this user
     * @type {Array<ObjectId>}
     * @default []
     * @description Array of user IDs who are following this user
     * @ref User
     * @example ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
     */
    followers: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            default: [] 
        }
    ],
    
    /**
     * Following array - users this user follows
     * @type {Array<ObjectId>}
     * @default []
     * @description Array of user IDs that this user is following
     * @ref User
     * @example ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
     */
    following: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            default: [] 
        }
    ],
    
    /**
     * Profile image URL
     * @type {String}
     * @default ""
     * @description URL to the user's profile picture
     * @example "https://cloudinary.com/image/upload/v1234567890/profile.jpg"
     */
    profileImg: { 
        type: String, 
        default: "" 
    },
    
    /**
     * Cover image URL
     * @type {String}
     * @default ""
     * @description URL to the user's cover/header image
     * @example "https://cloudinary.com/image/upload/v1234567890/cover.jpg"
     */
    coverImg: { 
        type: String, 
        default: "" 
    },
    
    /**
     * User biography
     * @type {String}
     * @default ""
     * @description Short description about the user, their interests, or personal statement
     * @example "Software engineer passionate about web development and open source. Coffee enthusiast ☕"
     */
    bio: { 
        type: String, 
        default: "" 
    },
    
    /**
     * Liked posts array - posts this user has liked
     * @type {Array<ObjectId>}
     * @default []
     * @description Array of post IDs that this user has liked
     * @ref Post
     * @example ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"]
     */
    likedPosts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Post", 
            default: [] 
        }
    ],
}, { 
    /**
     * Schema options
     * @description Enables automatic createdAt and updatedAt timestamps
     */
    timestamps: true 
});

/**
 * User Model
 * 
 * Creates a Mongoose model from the userSchema for database operations.
 * This model provides methods for CRUD operations and can be used throughout
 * the application to interact with user data.
 * 
 * @type {mongoose.Model}
 * @description Mongoose model for User documents
 */
const User = mongoose.model("User", userSchema);

export default User;
