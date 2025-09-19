# Bluesky Social Media Platform

A full-stack social media application built with React and Node.js, inspired by Twitter/X and Bluesky. This project provides a modern social networking experience with real-time features, user authentication, and a clean, responsive interface.

## Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT tokens
- **Post Management**: Create, edit, delete, and view posts
- **User Profiles**: Customizable user profiles with bio and profile pictures
- **Social Features**: Follow/unfollow users, like posts, and view timelines
- **Notifications**: Real-time notifications for user interactions
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **RESTful API**: Well-structured backend API with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js for security headers, bcrypt for password hashing
- **File Upload**: Cloudinary integration for image handling
- **Error Handling**: Centralized error handling middleware
- **Validation**: Joi validation for request data

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library
- **Lucide React** - Additional icon components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image upload and management
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Joi** - Data validation

## Project Structure

```
twitter/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── user.controller.js
│   │   └── notification.controller.js
│   ├── data/
│   │   └── seed.js          # Database seeding script
│   ├── db/
│   │   └── connectMongoDB.js # Database connection
│   ├── lib/
│   │   └── generateToken.js  # JWT token generation
│   ├── middlewares/
│   │   ├── authMiddleware.js # Authentication middleware
│   │   └── errorHandler.js   # Error handling middleware
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── notification.model.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── postService.js
│   │   ├── userService.js
│   │   └── notificationService.js
│   ├── validators/          # Input validation
│   │   └── userValidators.js
│   ├── .env                 # Environment variables
│   └── server.js            # Main server file
├── frontend/
│   └── twitter/
│       ├── public/          # Static files
│       ├── src/
│       │   ├── components/  # React components
│       │   │   ├── App.js
│       │   │   ├── MainPage.jsx
│       │   │   ├── LoginAndSignUp.jsx
│       │   │   ├── CreatePost.jsx
│       │   │   └── UserProfile.jsx
│       │   ├── App.css
│       │   ├── index.js
│       │   └── index.css
│       ├── package.json
│       └── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zoegongyinlu/Bluesky-Social-Media.git
   cd Bluesky-Social-Media
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend/twitter
   npm install
   cd ../..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=15d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=3001
   NODE_ENV=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # or for production
   npm run prod
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend/twitter
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Posts
- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create a new post
- `GET /api/v1/posts/:id` - Get a specific post
- `PUT /api/v1/posts/:id` - Update a post
- `DELETE /api/v1/posts/:id` - Delete a post
- `POST /api/v1/posts/:id/like` - Like/unlike a post

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `POST /api/v1/users/:id/follow` - Follow/unfollow a user

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read

## Database Schema

### User Model
```javascript
{
  fullName: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  bio: String,
  profilePicture: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

### Post Model
```javascript
{
  user: ObjectId (ref: User),
  text: String,
  img: String,
  likes: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  user: ObjectId (ref: User),
  type: String,
  message: String,
  read: Boolean,
  createdAt: Date
}
```

## Development

### Database Seeding
To populate the database with sample data:
```bash
cd backend
node data/seed.js
```

### Scripts
- `npm run build` - Install frontend dependencies
- `npm run prod` - Start production server
- `npm run dev` - Start development server (with nodemon)

## Deployment

The application is configured for deployment on platforms like Render, Heroku, or Vercel.

### Environment Variables for Production
Make sure to set the following environment variables in your deployment platform:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT`
- `NODE_ENV=production`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Yinlu Gong**
- GitHub: [@zoegongyinlu](https://github.com/zoegongyinlu)
**Yifei Chen**

## Acknowledgments

- Built as part of CS5610 Web Development course at Northeastern University
- Inspired by Twitter/X and Bluesky social media platforms
- Uses modern web development best practices and technologies
