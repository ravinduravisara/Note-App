# Collab Notes App

A full-stack collaborative note-taking application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register/login with JWT)
- Create, read, update, and delete notes
- Rich text editing with Quill editor
- Add collaborators to notes (viewer/editor roles)
- Search notes by title, content, or tags
- Pin and color-code notes
- Responsive UI with Tailwind CSS

## Tech Stack

**Client:** React, React Router, Tailwind CSS, React Quill, Axios  
**Server:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**  
   Edit `server/.env` with your MongoDB URI and JWT secret.

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Run the server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Run the client (in a separate terminal):**
   ```bash
   cd client
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser.

## Project Structure

```
collab-notes-app/
├── client/          # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout wrappers
│   │   ├── context/      # React context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API service functions
│   │   ├── utils/        # Axios instance
│   │   └── routes/       # Route definitions
│   └── public/
│
├── server/          # Express backend
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth & error middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   └── server.js
└── README.md
```
"# Note-App" 
