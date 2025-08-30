const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const auth = require('../middleware/auth');
const RSS = require('rss');

const router = express.Router();

// Export user data as JSON
router.get('/json', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).populate('author', 'username email');
    const userData = {
      user: {
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      },
      blogs: blogs,
      exportDate: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="devnote-export.json"');
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

// Export user data as CSV
router.get('/csv', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id });
    
    let csv = 'Title,Excerpt,Category,Status,Views,Likes,Created Date,Tags\n';
    
    blogs.forEach(blog => {
      const row = [
        `"${blog.title.replace(/"/g, '""')}"`,
        `"${blog.excerpt.replace(/"/g, '""')}"`,
        blog.category,
        blog.status,
        blog.views,
        blog.likes.length,
        blog.createdAt.toISOString().split('T')[0],
        `"${blog.tags.join(', ')}"`
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="devnote-export.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

module.exports = router;