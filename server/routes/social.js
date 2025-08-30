const express = require('express');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Follow/Unfollow user
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({ 
      following: !isFollowing,
      followersCount: targetUser.followers.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username avatar bio')
      .select('followers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's following
router.get('/following/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username avatar bio')
      .select('following');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add/Remove from reading list
router.post('/reading-list/:blogId', auth, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const user = await User.findById(req.user._id);

    const existingIndex = user.readingList.findIndex(
      item => item.blog.toString() === blogId
    );

    if (existingIndex > -1) {
      // Remove from reading list
      user.readingList.splice(existingIndex, 1);
    } else {
      // Add to reading list
      user.readingList.push({ blog: blogId });
    }

    await user.save();

    res.json({ 
      saved: existingIndex === -1,
      readingListCount: user.readingList.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reading list
router.get('/reading-list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'readingList.blog',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    const readingList = user.readingList
      .filter(item => item.blog)
      .map(item => ({
        ...item.blog.toObject(),
        savedAt: item.savedAt
      }));

    res.json(readingList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track blog share
router.post('/share/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.shares += 1;
    await blog.save();

    res.json({ shares: blog.shares });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Newsletter subscription
router.post('/newsletter', auth, async (req, res) => {
  try {
    const { subscribe } = req.body;
    const user = await User.findById(req.user._id);
    
    user.newsletterSubscription = subscribe;
    await user.save();

    res.json({ subscribed: user.newsletterSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog series
router.get('/series/:seriesName', async (req, res) => {
  try {
    const blogs = await Blog.find({
      'series.name': req.params.seriesName,
      status: 'approved'
    })
    .populate('author', 'username avatar')
    .sort({ 'series.part': 1 })
    .select('-comments');

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;