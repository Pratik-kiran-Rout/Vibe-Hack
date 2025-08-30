const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all approved blogs
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ status: 'approved' })
      .populate('author', 'name email')
      .populate('commentsCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ status: 'approved' });

    res.json({
      blogs,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending blogs with enhanced algorithm
router.get('/trending', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('author', 'name email')
      .populate('commentsCount');

    // Calculate trending score for each blog
    const blogsWithScore = blogs.map(blog => {
      const ageInHours = (Date.now() - new Date(blog.createdAt)) / (1000 * 60 * 60);
      const likesCount = blog.likes ? blog.likes.length : 0;
      const commentsCount = blog.commentsCount || 0;
      const views = blog.views || 0;
      
      // Trending score = (likes * 2 + comments * 3 + views) / age_in_hours
      const trendingScore = ageInHours > 0 ? (likesCount * 2 + commentsCount * 3 + views) / ageInHours : 0;
      
      return {
        ...blog.toObject(),
        trendingScore,
        likesCount
      };
    });

    // Sort by trending score and limit to 10
    const trendingBlogs = blogsWithScore
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);

    res.json(trendingBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced search with filters
router.get('/search', async (req, res) => {
  try {
    const { q, tag, author, sortBy = 'date', order = 'desc' } = req.query;
    
    let query = { status: 'approved' };
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Tag filter
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }
    
    // Author filter
    if (author) {
      const authorUser = await User.findOne({ name: { $regex: author, $options: 'i' } });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }
    
    let sortOptions = {};
    switch (sortBy) {
      case 'popularity':
        sortOptions = { views: order === 'desc' ? -1 : 1 };
        break;
      case 'likes':
        sortOptions = { 'likes.length': order === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { createdAt: order === 'desc' ? -1 : 1 };
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .populate('commentsCount')
      .sort(sortOptions);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('commentsCount');

    if (!blog || blog.status !== 'approved') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog
router.post('/', [auth, [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 50 })
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;
    
    const blog = new Blog({
      title,
      content,
      author: req.user._id,
      tags: tags || []
    });

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', [auth, [
  body('content').trim().isLength({ min: 1 })
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      blog: req.params.id
    });

    await comment.save();
    await comment.populate('author', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;