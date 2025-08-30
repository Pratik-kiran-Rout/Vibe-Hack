const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Initialize real-time features
handleConnection(io);

// Initialize backup system
scheduleBackups();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Real-time features enabled');
  console.log('Backup system initialized');
}).on('error', (err) => {
  console.error('Server startup error:', err);
});