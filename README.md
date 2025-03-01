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
