const express = require('express');
const Forum = require('../models/Forum');
const Challenge = require('../models/Challenge');
const WritingGroup = require('../models/WritingGroup');
const Review = require('../models/Review');
const Blog = require('../models/Blog');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// FORUMS
router.get('/forums', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    let query = {};
    if (category) query.category = category;

    const forums = await Forum.find(query)
      .populate('author', 'username avatar')
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(forums);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forums', auth, async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const forum = new Forum({
      title,
      description,
      category,
      tags: tags || [],
      author: req.user._id
    });
    await forum.save();
    await forum.populate('author', 'username avatar');
    res.status(201).json(forum);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forums/:id/posts', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const forum = await Forum.findById(req.params.id);
    if (!forum || forum.isLocked) {
      return res.status(404).json({ message: 'Forum not found or locked' });
    }

    forum.posts.push({
      author: req.user._id,
      content
    });
    await forum.save();
    await forum.populate('posts.author', 'username avatar');
    
    res.json(forum.posts[forum.posts.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CHALLENGES
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('participants.user', 'username avatar')
      .populate('winner', 'username avatar')
      .sort({ startDate: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/challenges', adminAuth, async (req, res) => {
  try {
    const { title, prompt, description, startDate, endDate, prizes } = req.body;
    const challenge = new Challenge({
      title,
      prompt,
      description,
      startDate,
      endDate,
      prizes: prizes || []
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/challenges/:id/participate', auth, async (req, res) => {
  try {
    const { blogId } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.status !== 'active') {
      return res.status(400).json({ message: 'Challenge not available' });
    }

    const existingParticipant = challenge.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (existingParticipant) {
      existingParticipant.submission = blogId;
    } else {
      challenge.participants.push({
        user: req.user._id,
        submission: blogId
      });
    }

    await challenge.save();
    res.json({ message: 'Participation recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// WRITING GROUPS
router.get('/groups', async (req, res) => {
  try {
    const groups = await WritingGroup.find({ isPrivate: false })
      .populate('creator', 'username avatar')
      .populate('members.user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/groups', auth, async (req, res) => {
  try {
    const { name, description, isPrivate, maxMembers, category } = req.body;
    const group = new WritingGroup({
      name,
      description,
      creator: req.user._id,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 50,
      category: category || 'General',
      members: [{ user: req.user._id, role: 'admin' }]
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/groups/:id/join', auth, async (req, res) => {
  try {
    const group = await WritingGroup.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.members.push({ user: req.user._id });
    await group.save();
    res.json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PEER REVIEWS
router.get('/reviews/requests', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('blog', 'title excerpt')
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reviews/request', auth, async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog || blog.author.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const review = new Review({
      blog: blogId,
      author: req.user._id,
      reviewer: null // Will be assigned when someone accepts
    });
    await review.save();
    res.status(201).json({ message: 'Review request created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reviews/:id/accept', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.status !== 'pending') {
      return res.status(404).json({ message: 'Review not available' });
    }

    review.reviewer = req.user._id;
    review.status = 'completed';
    await review.save();
    res.json({ message: 'Review accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reviews/:id/submit', auth, async (req, res) => {
  try {
    const { rating, feedback, comments, suggestions } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review || review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.feedback = feedback;
    review.comments = comments;
    review.suggestions = suggestions;
    review.status = 'completed';
    await review.save();

    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;