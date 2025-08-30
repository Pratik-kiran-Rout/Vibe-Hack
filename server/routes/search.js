const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Advanced search with filters
router.get('/blogs', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      author = '',
      dateFrom = '',
      dateTo = '',
      tags = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    let query = { status: 'approved' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Author filter
    if (author) {
      const authorUser = await User.findOne({ username: new RegExp(author, 'i') });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-comments');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related posts
router.get('/related/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Find related blogs based on tags and category
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      status: 'approved',
      $or: [
        { tags: { $in: blog.tags } },
        { category: blog.category }
      ]
    })
    .populate('author', 'username avatar')
    .sort({ views: -1, createdAt: -1 })
    .limit(5)
    .select('-comments');

    res.json(relatedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular tags
router.get('/tags/popular', async (req, res) => {
  try {
    const tagStats = await Blog.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(tagStats.map(tag => ({
      name: tag._id,
      count: tag.count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get author recommendations
router.get('/authors/recommended', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Get authors with most followers (excluding already followed and self)
    const recommendedAuthors = await User.aggregate([
      {
        $match: {
          _id: { 
            $nin: [...currentUser.following, currentUser._id] 
          },
          role: 'user'
        }
      },
      {
        $addFields: {
          followersCount: { $size: '$followers' }
        }
      },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'author',
          as: 'blogs'
        }
      },
      {
        $addFields: {
          blogsCount: { $size: '$blogs' }
        }
      },
      {
        $match: {
          blogsCount: { $gt: 0 }
        }
      },
      {
        $sort: { followersCount: -1, blogsCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          username: 1,
          bio: 1,
          avatar: 1,
          followersCount: 1,
          blogsCount: 1
        }
      }
    ]);

    res.json(recommendedAuthors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track reading activity
router.post('/reading-history/:blogId', auth, async (req, res) => {
  try {
    const { readTime = 0 } = req.body;
    const user = await User.findById(req.user._id);
    
    // Check if already in history
    const existingIndex = user.readingHistory.findIndex(
      item => item.blog.toString() === req.params.blogId
    );

    if (existingIndex > -1) {
      // Update existing entry
      user.readingHistory[existingIndex].readAt = new Date();
      user.readingHistory[existingIndex].readTime = readTime;
    } else {
      // Add new entry
      user.readingHistory.push({
        blog: req.params.blogId,
        readTime
      });
    }

    // Keep only last 100 entries
    if (user.readingHistory.length > 100) {
      user.readingHistory = user.readingHistory.slice(-100);
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reading history
router.get('/reading-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'readingHistory.blog',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    const history = user.readingHistory
      .filter(item => item.blog)
      .sort((a, b) => new Date(b.readAt) - new Date(a.readAt))
      .slice(0, 50);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;