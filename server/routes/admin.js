const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all blogs for admin (with all statuses)
router.get('/blogs', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    let query = {};
    if (status) {
      query.status = status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-comments');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending blogs
router.get('/blogs/pending', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'pending' })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .select('-comments');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog status
router.put('/blogs/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'hidden'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (admin)
router.delete('/blogs/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const pendingBlogs = await Blog.countDocuments({ status: 'pending' });
    const approvedBlogs = await Blog.countDocuments({ status: 'approved' });
    const rejectedBlogs = await Blog.countDocuments({ status: 'rejected' });
    const hiddenBlogs = await Blog.countDocuments({ status: 'hidden' });
    const totalUsers = await User.countDocuments();

    // Get recent activity
    const recentBlogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt author');

    // Get top blogs by views
    const topBlogs = await Blog.find({ status: 'approved' })
      .populate('author', 'username')
      .sort({ views: -1 })
      .limit(5)
      .select('title views likes comments author');

    res.json({
      stats: {
        totalBlogs,
        pendingBlogs,
        approvedBlogs,
        rejectedBlogs,
        hiddenBlogs,
        totalUsers
      },
      recentBlogs,
      topBlogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog analytics
router.get('/analytics/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('likes.user', 'username')
      .populate('comments.user', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const analytics = {
      views: blog.views,
      likes: blog.likes.length,
      comments: blog.comments.length,
      readTime: blog.readTime,
      createdAt: blog.createdAt,
      status: blog.status,
      recentComments: blog.comments.slice(-5),
      recentLikes: blog.likes.slice(-5)
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;