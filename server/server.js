const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const socialRoutes = require('./routes/social');
const searchRoutes = require('./routes/search');
const analyticsRoutes = require('./routes/analytics');
const adminToolsRoutes = require('./routes/adminTools');
const { generateSitemap } = require('./utils/sitemap');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin-tools', adminToolsRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
});