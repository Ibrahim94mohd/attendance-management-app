# Attendance Management System

A full-stack web application for managing daily attendance with user authentication, role-based access control, and comprehensive reporting features.

## Features

### Frontend (React + Vite + Tailwind CSS)
- **User Authentication**: Secure login and registration system
- **Dashboard**: Clean interface for marking daily attendance
- **Attendance History**: Personal attendance records with statistics
- **Admin Panel**: Administrative dashboard for managing all users
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean, professional interface with smooth animations

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Well-structured API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing for secure password storage
- **Role-Based Access**: User and admin roles with appropriate permissions
- **Data Validation**: Comprehensive input validation and error handling
- **Database Models**: Proper MongoDB schemas with relationships

## Project Structure

```
├── backend/                 # Backend API server
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
└── frontend/               # React frontend application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # React contexts (Auth)
    │   ├── pages/          # Page components
    │   ├── services/       # API service functions
    │   └── App.jsx         # Main app component
    └── public/
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance_db
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Attendance
- `POST /api/attendance` - Mark attendance for current day
- `GET /api/attendance` - Get user's attendance records
- `GET /api/attendance/today` - Check today's attendance status
- `GET /api/attendance/user/:userId` - Get specific user's attendance (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get current user profile

## Default Admin Account

For testing purposes, you can create an admin account by registering with the role field set to 'admin' or modify the user role directly in the database.

## Features Overview

### User Features
- **Daily Attendance Marking**: Mark attendance as Present or Absent for the current day only
- **Attendance History**: View personal attendance records with date, status, and statistics
- **Attendance Statistics**: See attendance percentage and summary statistics
- **Profile Management**: View and manage personal profile information

### Admin Features
- **User Management**: View all registered users with their attendance statistics
- **Attendance Monitoring**: Access detailed attendance records for any user
- **System Analytics**: Overview of system-wide attendance data
- **Role Management**: Admin-specific access controls

### Security Features
- **Password Hashing**: All passwords are securely hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication system
- **Route Protection**: Protected routes requiring authentication
- **Role-Based Access**: Separate permissions for users and administrators
- **Input Validation**: Comprehensive validation for all user inputs

## Technologies Used

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for custom designs
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **bcrypt**: Library for hashing passwords
- **jsonwebtoken**: Implementation of JSON Web Tokens
- **cors**: Cross-Origin Resource Sharing middleware

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.