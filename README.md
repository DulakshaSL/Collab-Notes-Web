Collab Notes

A modern collaborative notes application built with React, Node.js, Express, and MongoDB.
Users can create notes, share them with collaborators, manage archives, and organize ideas in a clean dashboard.

# Features

* Create and edit rich text notes
* Share notes with collaborators
* Viewer and editor permissions
* Pin important notes
* Archive and restore notes
* Trash and permanent delete
* Search notes
* User profile management
* Change password
* Profile picture support
* Smooth card animations
* Modern dashboard UI
* Secure authentication with JWT

# Tech Stack

Frontend
* React
* Vite
* Tailwind CSS
* Framer Motion
* TipTap Editor
* Axios

Backend
* Node.js
* Express
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

# Project Structure
client (Frontend)
  *components
  *pages
  *api
  *context
  *assets

server (Backend)
  *controllers
  *models
  *routes
  *middleware
  *config


# Installation

1 Clone the repository

git clone https://github.com/yourusername/collab-notes.git
cd collab-notes

2 Install backend dependencies

cd server
npm install

3 Install frontend dependencies

cd ../client
npm install

4 Environment Variables

Create a `.env` file inside the **server** folder.

Example:
PORT=
MONGO_URI=
JWT_SECRET= 
CLIENT_URL=

5. Running the Application

## Start backend server
cd server
npm run dev
Backend runs on

## Start frontend

cd client
npm run dev
Frontend runs on

# API Endpoints

Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/me
PUT /api/auth/change-password

Notes
GET /api/notes
POST /api/notes
PUT /api/notes/:id
PATCH /api/notes/:id/toggle-pin
PATCH /api/notes/:id/archive
PATCH /api/notes/:id/trash
PATCH /api/notes/:id/restore
DELETE /api/notes/:id

Collaborators
GET /api/notes/:id/collaborators
POST /api/notes/:id/collaborators
DELETE /api/notes/:id/collaborators/:userId
PATCH /api/notes/:id/collaborators/:userId

# Security
* Passwords hashed with **bcrypt**
* Authentication handled using **JWT**
* Protected routes with middleware
* Authorization checks for note ownership and collaborators

# Future Improvements
* Real time collaboration with WebSockets
* Reminder notifications
* File attachments
* Note tags and folders
* Dark and light theme switcher
* Mobile responsive improvements

# Author
Created by **Ashen Dulaksha**
