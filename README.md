# Whispr - Real-time Chat Application

**Whispr** is a real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It features live messaging using Socket.IO and secure user authentication via JWT (JSON Web Tokens).

---

## Tech Stack

| Layer                | Technology Used                         |
|----------------------|------------------------------------------|
| Frontend             | React.js (with Vite)                     |
| Backend              | Node.js, Express.js                      |
| Authentication       | JWT, cookie-based authentication         |
| Database             | MongoDB with Mongoose ORM                |
| Real-time Messaging  | Socket.IO                                |
| File Upload Handling | express-fileupload with Cloudinary       |


---

## 🚀 Features

- **User Authentication** – Secure login & signup with hashed passwords.  
- **Get All Users** – Fetch all users except the logged-in one.  
- **Send Message** – Send messages to specific users.  
- **Get Messages** – Retrieve chat history with any user.  
- **Real-time Messaging** – Socket.IO integration for instant message delivery.  

---



## Folder Structure

```text
/whispr
├── /client                  → React frontend (Vite)
│   ├── /public              → Static assets
│   ├── /src
│   │   ├── /components      → Reusable UI components
│   │   ├── /pages           → Page-level components (Login, Chat, etc.)
│   │   ├── /redux           → Redux slices & store configuration
│   │   ├── /utils           → Helper functions (e.g. API handlers)
│   │   ├── App.jsx          → Root component
│   │   └── main.jsx         → Entry point for React + Vite
│   └── vite.config.js       → Vite configuration
│
├── /server
│   ├── /config              → Environment and DB configuration
│   │   └── config.env
│   ├── /controllers         → Route controller functions
│   │   ├── user.controller.js
│   │   └── message.controller.js
│   ├── /database            → Database connection file
│   │   └── db.js
│   ├── /middlewares         → Custom middleware (e.g., error handling, auth)
│   │   ├── catchAsyncError.js
│   │   └── auth.middleware.js
│   ├── /models              → Mongoose schema definitions
│   │   ├── user.model.js
│   │   └── message.model.js
│   ├── /routes              → REST API route handlers
│   │   ├── user.routes.js
│   │   └── message.routes.js
│   ├── /utils               → Utility functions (e.g., JWT, Socket.IO)
│   │   ├── jwtToken.js
│   │   └── socket.js
│   ├── /temp                → Temporary file uploads (ignored in .gitignore)
│   ├── app.js               → Express app configuration
│   └── server.js            → Server entry point
```

---

## Environment Variables

Create a `.env` file at `server/config/config.env` with the following variables:

```env
PORT=4000
MONGO_URI=your_mongo_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=5
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## How to Run the Server

Follow these steps to get the backend server running locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/kunj-pandya/whispr-chat-application.git
    cd whispr-chat-application/server
    ```

2. Install server dependencies:

    ```bash
    npm install
    ```

3. Create the environment config file:

    ```bash
    mkdir config
    touch config/config.env
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

