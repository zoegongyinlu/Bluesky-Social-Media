import mongoose from "mongoose";

/**
 * Post Model Schema
 * 
 * This schema defines the structure and validation rules for post documents in the MongoDB database.
 * It represents a social media post with text content, optional images, likes, and comments.
 * Posts are the core content unit of the social media platform.
 * 
 * @class Post
 * @description Mongoose model for social media posts with engagement features
 * @author Twitter Clone Team
 * @version 1.0.0
 */
const postSchema = new mongoose.Schema({
    /**
     * User reference - the author of the post
     * @type {ObjectId}
     * @required true
     * @ref User
     * @description Reference to the user who created this post
     * @example "507f1f77bcf86cd799439011"
     */
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    
    /**
     * Post text content
     * @type {String}
     * @description The main text content of the post
     * @validation Must have either text or image (custom validator)
     * @example "Just finished reading an amazing book about machine learning! The future of AI is so exciting 🤖 #AI #MachineLearning #Tech"
     */
    text: { 
        type: String,
        validate: {
            /**
             * Custom validator to ensure post has either text or image
             * @param {String} value - The text value being validated
             * @returns {Boolean} - True if post has text or image, false otherwise
             */
            validator: function (value) {
              return value || this.img;
            },
            message: "A post must have either text or an image",
          },
    },
    
    /**
     * Post image URL
     * @type {String}
     * @description URL to an image associated with the post
     * @example "https://cloudinary.com/image/upload/v1234567890/post_image.jpg"
     */
    img: { 
        type: String 
    },
    
    /**
     * Likes array - users who liked this post
     * @type {Array<ObjectId>}
     * @default []
     * @description Array of user IDs who have liked this post
     * @ref User
     * @example ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
     */
    likes: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    
    /**
     * Comments array - comments on this post
     * @type {Array<Object>}
     * @default []
     * @description Array of comment objects with text and user reference
     * @structure {text: String, user: ObjectId}
     * @example [{"text": "Great post!", "user": "507f1f77bcf86cd799439011"}]
     */
    comments: [
        {
            /**
             * Comment text content
             * @type {String}
             * @required true
             * @description The text content of the comment
             * @example "Amazing post! Thanks for sharing! 😊"
             */
            text: { 
                type: String, 
                required: true 
            },
            
            /**
             * Comment author reference
             * @type {ObjectId}
             * @required true
             * @ref User
             * @description Reference to the user who wrote this comment
             * @example "507f1f77bcf86cd799439011"
             */
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User", 
                required: true 
            },
        },
    ],
}, { 
    /**
     * Schema options
     * @description Enables automatic createdAt and updatedAt timestamps
     */
    timestamps: true 
});

/**
 * Post Model
 * 
 * Creates a Mongoose model from the postSchema for database operations.
 * This model provides methods for CRUD operations and can be used throughout
 * the application to interact with post data, including creating, reading,
 * updating, and deleting posts, as well as managing likes and comments.
 * 
 * @type {mongoose.Model}
 * @description Mongoose model for Post documents
 */
const Post = mongoose.model("Post", postSchema);

export default Post;