# DevNote V2 - MERN Blog Platform

A full-stack blogging platform built with MongoDB, Express.js, React, and Node.js for VIBE HACK 2025.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation & Setup

1. **Clone and navigate to the project:**
```bash
cd devnote/v2
```

2. **Install all dependencies:**
```bash
npm run install-all
```

3. **Configure environment variables:**
   - Update `server/.env` with your MongoDB URI and JWT secret
   - Default MongoDB URI: `mongodb://localhost:27017/devnote`

4. **Start the application:**
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend client (port 3000).

### 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### 👤 Demo Accounts

**Admin Account:**
- Email: admin@devnote.com
- Password: password123

**Regular User:**
- Create a new account via signup

## 📁 Project Structure

```
devnote-v2/
├── server/              # Backend (Node.js/Express)
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── utils/           # Helper functions
├── client/              # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Helper functions
└── package.json         # Root package with scripts
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run install-all  # Install all dependencies
npm run build        # Build for production
```

## ✨ Features

### Core Features
- ✅ User authentication (JWT)
- ✅ Blog creation and management
- ✅ Admin approval system
- ✅ Search and filtering
- ✅ Responsive design
- ✅ Real-time updates

### User Features
- Create, edit, and delete blogs
- View published blogs
- Search and filter content
- User profiles and statistics
- Comment and like system

### Admin Features
- Dashboard with statistics
- Blog approval/rejection
- User management
- Content moderation

## 🔧 Configuration

### Database Setup
1. **Local MongoDB:**
   - Install MongoDB locally
   - Start MongoDB service
   - Database will be created automatically

2. **MongoDB Atlas:**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Update `MONGODB_URI` in `server/.env`

### Environment Variables
Update `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devnote
JWT_SECRET=your_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🎯 Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs` - Get all approved blogs
- `GET /api/blogs/trending` - Get trending blogs
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/:id` - Get single blog

### Admin
- `GET /api/admin/blogs` - Get all blogs (admin)
- `PUT /api/admin/blogs/:id/status` - Update blog status
- `GET /api/admin/stats` - Get dashboard statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏆 VIBE HACK 2025

Built for VIBE HACK 2025 - Devnovate Blogging Platform Challenge.

**Team:** DevNote
**Challenge:** Create a full-stack blogging platform with admin approval system

---

**Happy Blogging! 📝✨**