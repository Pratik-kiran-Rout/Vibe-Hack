const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Validate critical environment variables
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
  console.error('⚠️ WARNING: Using localhost MongoDB - data will not persist!');
  console.log('Please set MONGODB_URI to a proper MongoDB Atlas connection string');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('⚠️ WARNING: JWT_SECRET is too short or missing!');
}

const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { ensureDataExists, startPeriodicCheck } = require('./middleware/dataCheck');
const { handleConnection } = require('./socket/socketHandler');
const { scheduleBackups } = require('./utils/backup');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const socialRoutes = require('./routes/social');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');
const adminToolsRoutes = require('./routes/adminTools');
const communityRoutes = require('./routes/community');
const monetizationRoutes = require('./routes/monetization');
const healthRoutes = require('./routes/health');
const setupRoutes = require('./routes/setup');
const { generateSitemap } = require('./utils/sitemap');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security and performance middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Auto-restore data if database is empty
app.use(ensureDataExists);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin-tools', adminToolsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api', healthRoutes);
app.use('/api/setup', setupRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevNote API Server is running!',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      blogs: '/api/blogs',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// Sitemap route
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap();
    if (sitemap) {
      res.set('Content-Type', 'text/xml');
      res.send(sitemap);
    } else {
      res.status(500).send('Error generating sitemap');
    }
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Database:', process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || 'Unknown');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Don't exit, let the app run without DB for debugging
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Initialize real-time features
handleConnection(io);

// Initialize backup system
scheduleBackups();

// Start periodic data monitoring
startPeriodicCheck();
console.log('🔍 Started periodic data monitoring (every 30 minutes)');

// Auto-seed data on startup if needed
setTimeout(async () => {
  try {
    const mongoose = require('mongoose');
    const Blog = require('./models/Blog');
    const User = require('./models/User');
    
    if (mongoose.connection.readyState === 1) {
      const blogCount = await Blog.countDocuments();
      if (blogCount === 0) {
        console.log('🌱 Auto-seeding database on startup...');
        // Trigger auto-restore
        const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/setup/create-many-blogs`);
        console.log('✅ Auto-seed completed');
      }
    }
  } catch (error) {
    console.log('Auto-seed skipped:', error.message);
  }
}, 5000); // Wait 5 seconds after startup

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Real-time features enabled');
  console.log('Backup system initialized');
}).on('error', (err) => {
  console.error('Server startup error:', err);
});