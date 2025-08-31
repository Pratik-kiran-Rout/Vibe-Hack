const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/Blog');

const router = express.Router();

// Simple admin creation
router.get('/create-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: 'admin@devnote.com' });
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    
    res.json({ 
      message: 'Admin created successfully',
      credentials: { email: 'admin@devnote.com', password: 'admin123' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Simple blog seeding
router.get('/seed-blogs', async (req, res) => {
  try {
    // Create demo user
    let user = await User.findOne({ email: 'demo@devnote.com' });
    if (!user) {
      user = new User({
        username: 'demo_user',
        email: 'demo@devnote.com',
        password: 'password123',
        bio: 'Demo user'
      });
      await user.save();
    }

    // Check if blogs already exist
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs > 0) {
      return res.json({ message: 'Blogs already exist', count: existingBlogs });
    }

    // Create simple blogs
    const blogs = [
      {
        title: "Welcome to DevNote",
        content: "# Welcome!\n\nThis is your first blog post on DevNote. Start writing amazing content!",
        excerpt: "Welcome to DevNote - start your blogging journey here!",
        author: user._id,
        category: "Other",
        tags: ["welcome"],
        status: "approved",
        readTime: 1,
        views: 10
      },
      {
        title: "JavaScript Basics",
        content: "# JavaScript Basics\n\nLearn the fundamentals of JavaScript programming.",
        excerpt: "Essential JavaScript concepts every developer should know.",
        author: user._id,
        category: "Programming", 
        tags: ["javascript"],
        status: "approved",
        readTime: 5,
        views: 25
      }
    ];

    const createdBlogs = await Blog.insertMany(blogs);
    
    res.json({
      success: true,
      message: 'Blogs created successfully',
      count: createdBlogs.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blogs', error: error.message });
  }
});

module.exports = router;