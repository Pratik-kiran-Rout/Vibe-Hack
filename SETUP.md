# DevNote V2 - Setup Instructions

## Quick Setup for GitHub Users

### 1. Clone and Install
```bash
git clone <repository-url>
cd devnote-v2
npm run install-all
```

### 2. Environment Setup
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devnote
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

### 3. Start Application
```bash
npm run dev
```

### 4. Seed Database (Optional)
```bash
cd server
npm run seed
```

## Troubleshooting

### TypeScript Errors in Client
If you see red lines everywhere in the client folder:

1. **Install dependencies first:**
```bash
cd client
npm install
```

2. **Restart VS Code/IDE**

3. **Check TypeScript version:**
```bash
npx tsc --version
```

### Common Issues

**"Cannot find module 'express'"**
- Run: `npm run install-all`

**Frontend won't start**
- Check if port 3000 is free
- Run: `cd client && npm start`

**Database connection error**
- Make sure MongoDB is running
- Check MONGODB_URI in server/.env

## Demo Accounts
- Admin: admin@devnote.com / password123
- User: john@example.com / password123

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000