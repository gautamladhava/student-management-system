# 🎓 Student Management System

A full-stack web application for managing student records, courses, and academic performance.

## 🚀 Features

- **Student Management** - Add, update, delete, and view student profiles
- **Course Management** - Create and manage courses
- **Grade Management** - Record and track student grades
- **Search & Filter** - Find students by name, ID, or course
- **Dashboard** - View statistics and analytics
- **Authentication** - Secure login with JWT

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt for password hashing

### Database
- PostgreSQL
- Sequelize ORM

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/gautamladhava/student-management-system.git

# Navigate to backend
cd student-management-system/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials

# Run migrations
npm run migrate

# Start the server
npm start
