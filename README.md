# WTWR (What to Wear?) - Back End

## Description

The WTWR backend is a Node.js and Express-based API server. It handles authentication, user profiles, and clothing item management.
For development, it uses a local MongoDB instance (`mongodb://localhost`).  
In production, MongoDB is hosted and accessed from the deployed server via environment variables.

## Features

- RESTful API for user accounts and clothing items
- JWT authentication and authorization
- Celebrate/Joi validation and centralized error handling
- MongoDB with Mongoose ODM
- Winston logging for requests and errors
- Helmet & rate-limiting middleware for security
- Deployed with PM2 and Nginx on GCP

## Technologies Used

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Celebrate** + **Joi** + **Validator**
- **Winston** + **express-winston**
- **Helmet** + **express-rate-limit**
- **JWT** for authentication

## API Endpoints

### Authentication

- `POST /signup` – Register new user
- `POST /signin` – Login and receive token

### Users

- `GET /users/me` – Get current user profile
- `PATCH /users/me` – Update current user's name and avatar

### Clothing Items

- `GET /items` – Get all clothing items
- `GET /items/:itemId` – Get a specific clothing item
- `POST /items` – Create a new clothing item
- `DELETE /items/:itemId` – Delete a clothing item (if owner)
- `PUT /items/:itemId/likes` – Like an item
- `DELETE /items/:itemId/likes` – Unlike an item

## Deployed Application

- **Frontend:** [https://unfrank.crabdance.com](https://unfrank.crabdance.com)
- **Backend API:** [https://api.unfrank.crabdance.com](https://api.unfrank.crabdance.com)
