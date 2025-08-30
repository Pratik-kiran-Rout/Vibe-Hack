# 🚀 DEVNOTE V2 - VIBE HACK 2025 Roadmap

## Project Overview
Build a blogging and article platform using MERN stack with admin approval system, trending blogs, and responsive design.

## 📋 Requirements Summary
- **User Side**: Signup/Login, Blog creation, Profile management
- **Admin Side**: Dashboard, Approve/Reject blogs, Content management
- **Features**: Homepage, Search, Trending blogs, Responsive UI
- **Tech Stack**: MongoDB, Express.js, React, Node.js, JWT

---

## 🏗️ Project Architecture

```
devnote-v2/
├── backend/
│   ├── models/          # User, Blog, Comment schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── controllers/     # Business logic
│   ├── config/          # Database, JWT config
│   └── utils/           # Helper functions
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── context/     # Global state
│   │   ├── utils/       # Helper functions
│   │   └── styles/      # CSS/Tailwind
└── shared/              # Common types/constants
```

---

## 📅 Development Timeline

### **Phase 1: Setup & Architecture (Day 1)**
- [x] Project structure setup
- [x] Package.json configuration
- [x] Database connection
- [x] Basic Express server

### **Phase 2: Backend Development (Days 1-2)**
#### Models
- **User**: `{ name, email, password, role, avatar, createdAt }`
- **Blog**: `{ title, content, author, status, tags, likes, comments, views, createdAt }`
- **Comment**: `{ content, author, blog, createdAt }`

#### API Endpoints
```
Auth Routes:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

Blog Routes:
GET /api/blogs              # Public approved blogs
GET /api/blogs/trending     # Trending blogs
GET /api/blogs/search       # Search blogs
POST /api/blogs             # Create blog
PUT /api/blogs/:id          # Update own blog
DELETE /api/blogs/:id       # Delete own blog

Admin Routes:
GET /api/admin/blogs/pending
PUT /api/admin/blogs/:id/approve
PUT /api/admin/blogs/:id/reject
PUT /api/admin/blogs/:id/hide
DELETE /api/admin/blogs/:id

User Routes:
GET /api/users/profile
PUT /api/users/profile
GET /api/users/blogs        # Own blogs
```

### **Phase 3: Frontend Development (Days 2-3)**
#### Core Components
- **Layout**: Header, Footer, Sidebar
- **Auth**: Login, Register, ProtectedRoute
- **Blog**: BlogCard, BlogDetail, BlogEditor, BlogList
- **Admin**: Dashboard, PendingBlogs, BlogManagement
- **UI**: SearchBar, Pagination, LoadingSpinner

#### Pages
- **Public**: Home, BlogDetail, Search
- **User**: Profile, MyBlogs, CreateBlog, EditBlog
- **Admin**: Dashboard, ManageBlogs, Analytics

### **Phase 4: Core Features (Day 3)**
- [x] User authentication system
- [x] Blog CRUD operations
- [x] Admin approval workflow
- [x] Homepage with latest blogs
- [x] Search functionality
- [x] Basic responsive design

### **Phase 5: Advanced Features (Day 4)**
#### Trending Algorithm
```javascript
// Trending score = (likes * 2 + comments * 3 + views) / age_in_hours
const trendingScore = (likes * 2 + comments * 3 + views) / ageInHours;
```

#### Search & Filter
- Full-text search in title/content
- Filter by tags, date, author
- Sort by date, popularity, trending

#### Responsive Design
- Mobile-first Tailwind CSS
- Responsive navigation
- Optimized layouts

### **Phase 6: Bonus Features (Day 5)**
- **Markdown Editor**: react-markdown-editor-lite
- **Email Notifications**: Blog status updates
- **Analytics Dashboard**: Views, engagement metrics

### **Phase 7: Testing & Deployment (Day 5)**
- API testing
- Component testing
- User flow testing
- Deploy to Railway/Vercel

---

## 🎯 Development Priority

### **MVP Core (Must Have)**
1. User authentication (JWT)
2. Blog CRUD with admin approval
3. Homepage with latest blogs
4. Basic search functionality
5. Admin dashboard

### **Enhanced Features**
1. Trending blogs algorithm
2. Comments system
3. User profiles
4. Advanced search/filters
5. Responsive design

### **Bonus Features**
1. Markdown editor
2. Email notifications
3. Analytics dashboard
4. Image upload
5. Social sharing

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **Email**: nodemailer

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State**: Context API + useReducer
- **Forms**: React Hook Form
- **Editor**: react-markdown-editor-lite

### DevOps
- **Backend Hosting**: Railway/Render
- **Frontend Hosting**: Vercel/Netlify
- **Database**: MongoDB Atlas
- **Version Control**: Git + GitHub

---

## 🔒 Security Considerations
- JWT token management
- Password hashing (bcrypt)
- Input validation & sanitization
- XSS protection
- Rate limiting
- CORS configuration

---

## 📱 Responsive Design Strategy
- Mobile-first approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Touch-friendly navigation
- Optimized images and loading

---

## 🚀 Deployment Strategy
1. **Development**: Local MongoDB + React dev server
2. **Staging**: MongoDB Atlas + Vercel preview
3. **Production**: Full deployment with environment variables

---

## 📊 Success Metrics
- User registration and login functionality
- Blog creation and approval workflow
- Admin content management
- Search and trending features
- Mobile responsiveness
- Performance (< 3s load time)

---

## 🎯 Next Steps
1. Initialize project structure
2. Set up backend with Express and MongoDB
3. Implement authentication system
4. Create blog models and routes
5. Build React frontend
6. Implement admin dashboard
7. Add trending and search features
8. Deploy and test

---

*Last Updated: January 2025*
*VIBE HACK 2025 - Devnovate Blogging Platform*