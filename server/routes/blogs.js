const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { auth } = require('../middleware/auth');
const { blogLimiter, commentLimiter } = require('../middleware/rateLimiter');
const { moderateContent } = require('../utils/contentModeration');

const router = express.Router();

// Get all approved blogs with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const category = req.query.category || '';
    const sort = req.query.sort || 'createdAt';

    let query = { status: 'approved' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ [sort]: -1 })
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trending blogs
router.get('/trending', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('author', 'username avatar')
      .sort({ views: -1, 'likes.length': -1 })
      .limit(10)
      .select('-comments');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.user', 'username avatar');

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
router.post('/', auth, blogLimiter, [
  body('title').isLength({ min: 5, max: 200 }).trim().escape(),
  body('content').optional().isLength({ min: 1 }),
  body('excerpt').optional().isLength({ min: 10, max: 300 }).trim().escape(),
  body('tags').optional().isArray(),
  body('category').optional().isIn(['Technology', 'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'DevOps', 'Design', 'Career', 'Tutorial', 'News', 'Opinion', 'Other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, tags, featuredImage, category, isDraft, series } = req.body;

    // Calculate read time (average 200 words per minute)
    const wordCount = content ? content.split(' ').length : 0;
    const readTime = Math.ceil(wordCount / 200) || 1;

    // Content moderation
    let status = 'draft';
    if (!isDraft && content && excerpt) {
      const moderation = moderateContent(content + ' ' + title + ' ' + excerpt);
      if (moderation.action === 'reject') {
        return res.status(400).json({ 
          message: 'Content flagged by automated moderation. Please review and resubmit.',
          flags: moderation.flags 
        });
      }
      status = moderation.action === 'review' ? 'pending' : 'approved';
    }

    const blog = new Blog({
      title,
      content: content || '',
      excerpt: excerpt || '',
      author: req.user._id,
      tags: tags || [],
      featuredImage: featuredImage || '',
      category: category || 'Other',
      series: series || { name: '', part: 0 },
      readTime,
      isDraft: isDraft !== false,
      status
    });

    await blog.save();
    await blog.populate('author', 'username avatar');

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update blog (only by author)
router.put('/:id', auth, [
  body('title').optional().isLength({ min: 5, max: 200 }).trim().escape(),
  body('content').optional().isLength({ min: 100 }),
  body('excerpt').optional().isLength({ min: 10, max: 300 }).trim().escape()
], async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, excerpt, tags, featuredImage, category, isDraft, series } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) {
      updateData.content = content;
      const wordCount = content.split(' ').length;
      updateData.readTime = Math.ceil(wordCount / 200);
    }
    if (excerpt) updateData.excerpt = excerpt;
    if (tags) updateData.tags = tags;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (category) updateData.category = category;
    if (series) updateData.series = series;
    if (isDraft !== undefined) {
      updateData.isDraft = isDraft;
      updateData.status = isDraft ? 'draft' : (content && excerpt ? 'pending' : 'draft');
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('author', 'username avatar');

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog || blog.status !== 'approved') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likeIndex = blog.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push({ user: req.user._id });
    }

    await blog.save();
    res.json({ likes: blog.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', auth, commentLimiter, [
  body('text').isLength({ min: 1, max: 500 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    
    if (!blog || blog.status !== 'approved') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      user: req.user._id,
      text: req.body.text
    };

    blog.comments.push(newComment);
    await blog.save();
    
    await blog.populate('comments.user', 'username avatar');
    
    res.status(201).json(blog.comments[blog.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's blogs (including drafts)
router.get('/user/my-blogs', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select('-comments');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's drafts
router.get('/user/drafts', auth, async (req, res) => {
  try {
    const drafts = await Blog.find({ 
      author: req.user._id, 
      status: 'draft' 
    })
      .sort({ updatedAt: -1 })
      .select('-comments');

    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (only by author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;