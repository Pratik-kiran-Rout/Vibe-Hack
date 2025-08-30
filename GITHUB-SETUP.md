# 🚀 DevNote V2 - GitHub Setup Guide

## ⚡ Quick Setup (3 Steps)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd devnote-v2
npm run install-all
```

### 2. Environment Setup
Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devnote
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start Application
```bash
npm run dev
```

## 🔧 Fix TypeScript Errors

If you see red lines in client folder:

1. **Install client dependencies:**
```bash
cd client
npm install
```

2. **Restart VS Code completely**

3. **If still errors, create `.vscode/settings.json` in client folder:**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

## 📊 Create Admin & Sample Data
```bash
cd server
npm run seed
```

## 🌐 Access Application
- Frontend: http://localhost:3000
- Admin: admin@devnote.com / password123
- User: john@example.com / password123

## ❗ Common Issues

**"Cannot find module 'express'"**
→ Run: `npm run install-all`

**TypeScript errors everywhere**
→ Run: `cd client && npm install` then restart IDE

**Invalid admin credentials**
→ Run: `cd server && npm run seed`

**MongoDB connection error**
→ Make sure MongoDB is running locally