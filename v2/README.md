# 🚀 DevNote V2 - VIBE HACK 2025

A modern blogging platform built with MERN stack featuring admin approval system, trending blogs, and responsive design.

## ⚡ Quick Start

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend servers
npm run dev
```

**That's it!** The application will be running at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🛠️ Available Scripts

```bash
npm run dev           # Start both frontend and backend
npm run server        # Start backend only
npm run client        # Start frontend only
npm run install-all   # Install all dependencies
npm run seed-admin    # Create admin user
npm run build         # Build frontend for production
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)
- npm or yarn

## 🎯 Features

- ✅ User Authentication (JWT)
- ✅ Blog Creation & Management
- ✅ Admin Approval System
- ✅ Search & Trending Blogs
- ✅ Comments & Likes
- ✅ Responsive Design
- ✅ User Profiles & Dashboard
- ✅ Admin Dashboard

## 🔧 Environment Setup

1. **Database**: MongoDB Atlas is pre-configured
2. **Admin User**: Run `npm run seed-admin` to create admin account
3. **Dependencies**: Run `npm run install-all`

### 👤 Default Admin Account
- **Email**: admin@devnote.com
- **Password**: admin123456

## 📱 Usage

1. **Register** a new account
2. **Create** blog posts (requires admin approval)
3. **Admin Access**: Manually change user role to 'admin' in database
4. **Approve Blogs**: Use admin dashboard to manage content

## 🏗️ Project Structure

```
devnote-v2/
├── backend/           # Node.js/Express API
├── frontend/          # React Application  
├── shared/           # Common utilities
└── package.json      # Unified development scripts
```

---

**Built for VIBE HACK 2025** 🎉