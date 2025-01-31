# WTWR (What to Wear?) - Back End

## Description

The WTWR backend is a Node.js and Express-based server. This application allows users to like clothing items. The backend connects to a MongoDB database to store and retrieve user and clothing item data.

## Features

- RESTful API for managing clothing items and users
- CRUD operations for clothing items
- MongoDB integration using Mongoose
- Error handling

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for storing user and clothing data
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **ESLint & Prettier** - Code formatting and linting
- **GitHub Actions** - CI/CD for automated testing

## API Endpoints

### User

- `GET /users` - Get all users
- `GET /users/:userId` - Get a specific user
- `POST /users` - Create a new user

### Clothing Items

- `GET /items` - Get all clothing items
- `GET /items/:itemId` - Get a specific clothing item
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete a clothing item
- `PUT /items/:itemId/likes` - Like a clothing item
- `DELETE /items/:itemId/likes` - Unlike a clothing item
