# Real-Time Chat Application

A full-stack, real-time chat application built with **NestJS** (backend) and **Next.js** (frontend), featuring secure authentication, friend management, and live messaging powered by **Socket.IO**. This project demonstrates a robust architecture with a MySQL database, TypeORM ORM, and modular CSS styling.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **User Authentication**: Register, login, and logout with JWT-based authentication and password hashing.
- **Real-Time Messaging**: Send and receive messages instantly using Socket.IO, with typing indicators and chat history.
- **Friend System**: Search users, send/accept/reject friend requests, and view friend lists.
- **Profile Management**: Update name, bio, profile picture, email (with verification), and password.
- **Notifications**: Real-time friend request updates and UI notifications for actions like successful registration.
- **Responsive Design**: Clean, modular CSS for a user-friendly experience across devices.
- **Security**: Role-based access (admin/user/guest), login attempt limits, and email verification.

---

## Tech Stack
### Backend
- **NestJS**: Progressive Node.js framework with TypeScript.
- **TypeORM**: ORM for MySQL database management.
- **Socket.IO**: Real-time bidirectional communication.
- **JWT**: Token-based authentication.
- **bcryptjs**: Password hashing.
- **Nodemailer**: Email verification service.
- **Multer**: File uploads for profile pictures.
- **MySQL**: Relational database.

### Frontend
- **Next.js**: React framework for server-side rendering and static generation.
- **React**: UI library with hooks and state management.
- **Socket.IO Client**: For real-time client-server communication.
- **CSS Modules**: Scoped styling for components.

---

## Project Structure
├── backend/
│   ├── src/
│   │   ├── app.module.ts          # Root module
│   │   ├── user/                  # User management module
│   │   ├── auth/                  # Authentication module
│   │   ├── chat/                  # Chat functionality module
│   │   ├── friend/                # Friend system module
│   │   ├── profile/              # Profile management module
│   │   ├── email/                # Email service module
│   └── uploads/                  # Directory for file uploads
├── frontend/
│   ├── components/               # Reusable React components
│   │   ├── AuthPage.tsx          # Login/register page
│   │   ├── MainApp.tsx           # Main app layout
│   │   ├── ChatSection.tsx       # Chat interface
│   │   ├── Sidebar.tsx          # Friend list sidebar
│   │   ├── Header.tsx           # Navigation header
│   │   ├── ProfileModal.tsx     # Profile editor
│   │   └── DoveAnimation.tsx    # Fun animation for actions
│   ├── styles/                  # CSS modules
│   └── utils/                   # Utility functions (e.g., fetchWithAuth)

---

## Prerequisites
- **Node.js** (>= 16.x)
- **MySQL** (>= 8.x)
- **npm** or **yarn**
- A Gmail account for Nodemailer (or another SMTP service)

---

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   
1:Install backend dependencies:
bash
cd backend
npm install
Install frontend dependencies:
bash
cd ../frontend
npm install

---

## Configuration

Backend Environment: Create a .env file in the backend/ directory:
.env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=chat_app_db
JWT_SECRET=your_jwt_secret

Frontend Environment: Create a .env.local file in the frontend/ directory:
.env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

Email Configuration: Update email.service.ts with your SMTP credentials:
auth: {
  user: 'your-email@gmail.com',
  pass: 'your-email-password', // Use an App Password if 2FA is enabled
}

Database Setup:
Create a MySQL database named chat_app_db.
TypeORM will auto-create tables with synchronize: true.

---

## Running the Application

Start the backend:
bash
cd backend
npm run start:dev
Runs on http://localhost:3000.

Start the frontend:
bash
cd frontend
npm run dev
Runs on http://localhost:3001.
Open http://localhost:3001 in your browser.

---

## API Endpoints

Endpoint	Method	Description	Protected
/auth/login	POST	User login	No
/user/register	POST	User registration	No
/friends/request/:id	POST	Send friend request	Yes
/friends/accept/:id	POST	Accept friend request	Yes
/chat/send	POST	Send a chat message	Yes
/chat/history/:friendId	GET	Get chat history	Yes
/profile	GET	Fetch user profile	Yes
/profile/update-picture	PUT	Update profile picture	Yes
/user/search	GET	Search users by keyword	Yes

---

## Frontend Components

AuthPage: Handles login and registration with password strength checker.
MainApp: Core layout with Header, Sidebar, and ChatSection.
ChatSection: Real-time chat with typing indicators and message history.
Sidebar: Displays friends and pending requests with accept/reject actions.
Header: Navigation with search, notifications, and profile dropdown.
ProfileModal: Edit profile details, picture, email, and password.
DoveAnimation: Visual feedback for actions like sending messages.

---

## Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.
