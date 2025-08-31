# DevNote V2 - Advanced MERN Blogging Platform

<div align="center">

![DevNote Logo](https://img.shields.io/badge/DevNote-V2-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![VIBE HACK 2025](https://img.shields.io/badge/VIBE%20HACK-2025-orange?style=for-the-badge)

**A full-stack blogging platform with advanced features, admin approval system, and real-time capabilities**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🛠️ Setup Guide](#quick-start) • [🤝 Contributing](#contributing)

</div>

## 🌟 Features

### 🔐 Authentication & User Management
- JWT-based secure authentication
- Role-based access control (User/Admin)
- User profiles with bio, avatar, and social features
- Reading lists and history tracking
- Premium subscription system

### 📝 Advanced Blog Management
- Rich markdown editor with live preview
- Syntax highlighting for code blocks
- Draft/Publish workflow with admin approval
- Blog series and categorization
- Scheduled publishing
- Premium content support

### 🎯 Content Discovery
- Advanced search with filters (category, tags, author)
- Trending algorithm based on engagement metrics
- Related posts recommendations
- Popular tags and author recommendations
- RSS feed generation

### 👨‍💼 Admin Dashboard
- Comprehensive analytics and statistics
- Blog approval/rejection system
- User management and moderation
- Content reporting and moderation tools
- Bulk actions for content management
- Export/Import tools

### 🚀 Advanced Features
- Real-time comments and notifications
- Social features (follow/unfollow, likes)
- Monetization (tips, sponsored posts)
- PWA support with offline reading
- SEO optimization with sitemap generation
- Email notifications and newsletters

### 📱 Modern UI/UX
- Fully responsive design
- Dark/Light theme toggle
- Accessibility features
- Particle background animations
- Reading progress indicators
- Infinite scroll pagination

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Socket.io** - Real-time features
- **Nodemailer** - Email services
- **Multer** - File uploads
- **Helmet** & **CORS** - Security

### Frontend
- **React 18** with **TypeScript** - UI framework
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **React Quill** - Rich text editor
- **Socket.io Client** - Real-time updates

### DevOps & Tools
- **Concurrently** - Development workflow
- **Morgan** - Logging
- **Compression** - Performance
- **Rate Limiting** - API protection
- **PWA** - Progressive Web App features

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- Windows (for batch scripts) or compatible terminal

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/devnote-v2.git
cd devnote-v2
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Environment Setup**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devnote
JWT_SECRET=your_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. **Verify setup (optional)**
```bash
node verify-setup.js
```

5. **Start the application**
```bash
# Option 1: Use npm scripts
npm run dev

# Option 2: Use Windows batch file
start-dev.bat

# Option 3: Manual start
# Terminal 1:
cd server && npm run dev
# Terminal 2:
cd client && npm start
```

### 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin

### 👤 Demo Accounts
- **Admin**: admin@devnote.com / password123
- **User**: john@example.com / password123

## 📁 Project Structure

```
devnote-v2/
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # CSS and design tokens
│   └── package.json
├── server/                # Node.js Backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   ├── socket/           # Real-time handlers
│   ├── utils/            # Helper functions
│   └── package.json
├── package.json          # Root package with scripts
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only

# Setup
npm run install-all  # Install all dependencies

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
cd server && npm run seed  # Seed database with sample data
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Blog Endpoints
```
GET    /api/blogs              # Get approved blogs
GET    /api/blogs/trending     # Get trending blogs
GET    /api/blogs/search       # Search blogs
POST   /api/blogs              # Create blog
PUT    /api/blogs/:id          # Update blog
DELETE /api/blogs/:id          # Delete blog
```

### Admin Endpoints
```
GET /api/admin/blogs           # Get all blogs
PUT /api/admin/blogs/:id/status # Update blog status
GET /api/admin/stats           # Dashboard statistics
```

### Advanced Features
```
GET  /api/search               # Advanced search
GET  /api/analytics            # Analytics data
POST /api/social/follow        # Follow user
POST /api/monetization/tip     # Tip author
```

## 🎨 Key Features Showcase

### Rich Markdown Editor
- Live preview with syntax highlighting
- Support for code blocks, tables, and media
- Auto-save functionality
- Drag & drop image uploads

### Advanced Search
- Full-text search across title, content, and tags
- Filter by category, author, and date
- Sort by relevance, date, or popularity
- Real-time search suggestions

### Admin Dashboard
- Real-time statistics and analytics
- Blog approval workflow
- User management tools
- Content moderation system

### Real-time Features
- Live comments and notifications
- Real-time blog updates
- Socket.io integration
- Instant user interactions

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- XSS protection

## 📱 Progressive Web App

- Service worker for offline functionality
- Installable on mobile devices
- Offline reading capabilities
- Push notifications support
- Responsive design for all devices

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

### Environment Variables
Ensure all environment variables are set for production deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 VIBE HACK 2025

Built for **VIBE HACK 2025** - Devnovate Blogging Platform Challenge

**Team**: DevNote  
**Challenge**: Create a comprehensive blogging platform with advanced features and admin management

## 🙏 Acknowledgments

- VIBE HACK 2025 organizers
- Open source community
- Contributors and testers

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[Report Bug](https://github.com/yourusername/devnote-v2/issues) • [Request Feature](https://github.com/yourusername/devnote-v2/issues) • [Documentation](https://github.com/yourusername/devnote-v2/wiki)

</div>
