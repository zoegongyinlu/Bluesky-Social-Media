import mongoose from "mongoose";

/**
 * Notification Model Schema
 * 
 * This schema defines the structure and validation rules for notification documents in the MongoDB database.
 * It represents user notifications for various social interactions like follows, likes, and comments.
 * Notifications help users stay informed about activities related to their account and content.
 * 
 * @class Notification
 * @description Mongoose model for user notifications with social interaction tracking
 * @author Twitter Clone Team
 * @version 1.0.0
 */
const notificationSchema = new mongoose.Schema ({
    /**
     * From user reference - the user who triggered the notification
     * @type {ObjectId}
     * @required true
     * @ref User
     * @description Reference to the user who performed the action that generated this notification
     * @example "507f1f77bcf86cd799439011"
     */
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    /**
     * To user reference - the user who receives the notification
     * @type {ObjectId}
     * @required true
     * @ref User
     * @description Reference to the user who should receive this notification
     * @example "507f1f77bcf86cd799439012"
     */
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    /**
     * Notification type - the kind of interaction that triggered the notification
     * @type {String}
     * @required true
     * @enum ["follow", "like", "comment"]
     * @description The type of social interaction that generated this notification
     * @example "follow" - when someone follows the user
     * @example "like" - when someone likes the user's post
     * @example "comment" - when someone comments on the user's post
     */
    type: {
        type: String,
        required: true,
        enum: ["follow", "like", "comment"]
    },
    
    /**
     * Post reference - optional reference to the post involved in the notification
     * @type {ObjectId}
     * @ref Post
     * @description Reference to the post that is relevant to this notification (for like/comment types)
     * @example "507f1f77bcf86cd799439013"
     * @note Only present for "like" and "comment" notification types
     */
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    
    /**
     * Read status - whether the notification has been read by the user
     * @type {Boolean}
     * @default false
     * @description Indicates whether the user has seen/read this notification
     * @example true - notification has been read
     * @example false - notification is unread
     */
    read: {
        type: Boolean, 
        default: false
    },
}, {
    /**
     * Schema options
     * @description Enables automatic createdAt and updatedAt timestamps
     */
    timestamps: true
});

/**
 * Notification Model
 * 
 * Creates a Mongoose model from the notificationSchema for database operations.
 * This model provides methods for CRUD operations and can be used throughout
 * the application to manage user notifications, including creating new notifications,
 * marking them as read, and querying notifications for specific users.
 * 
 * @type {mongoose.Model}
 * @description Mongoose model for Notification documents
 */
const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;