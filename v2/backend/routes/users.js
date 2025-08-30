const express = require('express');
const Blog = require('../models/Blog');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's blogs
router.get('/blogs', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('commentsCount')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments({ author: req.user._id });
    const approvedBlogs = await Blog.countDocuments({ 
      author: req.user._id, 
      status: 'approved' 
    });

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
      },
      stats: {
        totalBlogs,
        approvedBlogs,
        pendingBlogs: totalBlogs - approvedBlogs
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;