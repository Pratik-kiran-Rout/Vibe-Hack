const express = require('express');
const RSS = require('rss');
const Blog = require('../models/Blog');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate RSS feed for user's blogs
router.get('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blogs = await Blog.find({ 
      author: req.user._id, 
      status: 'approved' 
    }).sort({ createdAt: -1 }).limit(20);

    const feed = new RSS({
      title: `${user.username}'s DevNote Blog`,
      description: `Latest blog posts by ${user.username}`,
      feed_url: `${req.protocol}://${req.get('host')}/api/rss/user/${user._id}`,
      site_url: `${req.protocol}://${req.get('host')}`,
      language: 'en',
      pubDate: new Date(),
      ttl: '60'
    });

    blogs.forEach(blog => {
      feed.item({
        title: blog.title,
        description: blog.excerpt,
        url: `${req.protocol}://${req.get('host')}/post/${blog._id}`,
        date: blog.createdAt,
        categories: [blog.category, ...blog.tags]
      });
    });

    res.json({ 
      message: 'RSS feed generated successfully',
      feedUrl: `${req.protocol}://${req.get('host')}/api/rss/user/${user._id}`
    });
  } catch (error) {
    res.status(500).json({ message: 'RSS generation failed', error: error.message });
  }
});

// Serve RSS feed for specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blogs = await Blog.find({ 
      author: req.params.userId, 
      status: 'approved' 
    }).sort({ createdAt: -1 }).limit(20);

    const feed = new RSS({
      title: `${user.username}'s DevNote Blog`,
      description: `Latest blog posts by ${user.username}`,
      feed_url: `${req.protocol}://${req.get('host')}/api/rss/user/${user._id}`,
      site_url: `${req.protocol}://${req.get('host')}`,
      language: 'en',
      pubDate: new Date(),
      ttl: '60'
    });

    blogs.forEach(blog => {
      feed.item({
        title: blog.title,
        description: blog.excerpt,
        url: `${req.protocol}://${req.get('host')}/post/${blog._id}`,
        date: blog.createdAt,
        categories: [blog.category, ...blog.tags]
      });
    });

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml());
  } catch (error) {
    res.status(500).json({ message: 'RSS feed error', error: error.message });
  }
});

// Global RSS feed for all approved blogs
router.get('/feed.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    const feed = new RSS({
      title: 'DevNote - Developer Blog Platform',
      description: 'Latest blog posts from DevNote community',
      feed_url: `${req.protocol}://${req.get('host')}/api/rss/feed.xml`,
      site_url: `${req.protocol}://${req.get('host')}`,
      language: 'en',
      pubDate: new Date(),
      ttl: '60'
    });

    blogs.forEach(blog => {
      feed.item({
        title: blog.title,
        description: blog.excerpt,
        url: `${req.protocol}://${req.get('host')}/post/${blog._id}`,
        author: blog.author.username,
        date: blog.createdAt,
        categories: [blog.category, ...blog.tags]
      });
    });

    res.set('Content-Type', 'application/rss+xml');
    res.send(feed.xml());
  } catch (error) {
    res.status(500).json({ message: 'RSS feed error', error: error.message });
  }
});

module.exports = router;