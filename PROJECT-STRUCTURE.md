# 📁 DevNote V2 - Project Structure

## 🏗️ Complete File Structure

```
devnote-v2/
├── 📦 package.json                 # Root package with unified scripts
├── 📚 README.md                    # Main documentation
├── 🔧 GITHUB-SETUP.md             # Setup guide for GitHub users
├── 🚫 .gitignore                  # Git ignore rules
├── 🖥️ server/                     # Backend (Node.js/Express)
│   ├── 📦 package.json            # Backend dependencies
│   ├── 🔧 .env.example            # Environment template
│   ├── 🚀 server.js               # Main server file
│   ├── 🌱 seed.js                 # Database seeding script
│   ├── 📊 models/                 # MongoDB schemas
│   │   ├── User.js                # User model
│   │   └── Blog.js                # Blog model
│   ├── 🛣️ routes/                 # API endpoints
│   │   ├── auth.js                # Authentication routes
│   │   ├── blogs.js               # Blog CRUD routes
│   │   └── admin.js               # Admin management routes
│   ├── 🛡️ middleware/             # Express middleware
│   │   └── auth.js                # JWT authentication
│   ├── 🔧 utils/                  # Helper functions
│   │   └── email.js               # Email utilities
│   └── 🎮 controllers/            # Business logic (placeholder)
├── 🌐 client/                     # Frontend (React/TypeScript)
│   ├── 📦 package.json            # Frontend dependencies
│   ├── 🔧 .env.example            # Client environment template
│   ├── ⚙️ tsconfig.json           # TypeScript configuration
│   ├── 🌍 public/                 # Static files
│   │   └── index.html             # Main HTML template
│   └── 📁 src/                    # Source code
│       ├── 🚀 index.tsx           # React entry point
│       ├── 📱 App.tsx             # Main App component
│       ├── 🎨 App.css             # App styles
│       ├── 🎨 index.css           # Global styles
│       ├── 📝 types.ts            # TypeScript definitions
│       ├── 🧩 components/         # Reusable components
│       │   ├── Header.tsx         # Navigation header
│       │   ├── BlogCard.tsx       # Blog display card
│       │   ├── SearchBar.tsx      # Search functionality
│       │   ├── ProtectedRoute.tsx # Route protection
│       │   └── ParticleBackground.tsx # Background effects
│       ├── 📄 pages/              # Page components
│       │   ├── Home.tsx           # Homepage
│       │   ├── Login.tsx          # User login
│       │   ├── Signup.tsx         # User registration
│       │   ├── Blogs.tsx          # Blog listing
│       │   ├── BlogPost.tsx       # Individual blog view
│       │   ├── CreateBlog.tsx     # Blog creation
│       │   ├── Profile.tsx        # User profile
│       │   ├── AdminDashboard.tsx # Admin panel
│       │   ├── Contact.tsx        # Contact page
│       │   ├── Newsletter.tsx     # Newsletter signup
│       │   ├── Podcasts.tsx       # Podcasts (placeholder)
│       │   └── JobBoard.tsx       # Job board (placeholder)
│       ├── 🔐 context/            # React context
│       │   └── AuthContext.tsx    # Authentication state
│       ├── 📊 data/               # Static data (placeholder)
│       ├── 🌐 services/           # API services (placeholder)
│       └── 🔧 utils/              # Utility functions (placeholder)
```

## ✅ All Folders Tracked

Every folder now contains at least one file to ensure Git tracks the complete structure.

## 🚀 Quick Commands

```bash
# Install everything
npm run install-all

# Start development
npm run dev

# Create admin user
cd server && npm run seed
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

## 👤 Demo Accounts

- **Admin:** admin@devnote.com / password123
- **User:** john@example.com / password123