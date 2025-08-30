# 🚀 DevNote V2 - GitHub Setup Guide

## ⚡ Quick Setup (3 Steps)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd devnote-v2
npm run install-all
```

### 2. Environment Setup
Copy and rename the example files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Or manually create:
- `server/.env` (copy from server/.env.example)
- `client/.env` (copy from client/.env.example)

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