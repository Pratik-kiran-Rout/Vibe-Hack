const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Debug route to test admin login
router.get('/test-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@devnote.com' });
    if (!admin) {
      return res.json({ message: 'Admin not found' });
    }
    
    const isMatch = await admin.comparePassword('admin123');
    res.json({ 
      message: 'Admin found',
      passwordMatch: isMatch,
      adminRole: admin.role,
      adminId: admin._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error testing admin', error: error.message });
  }
});

// Reset and create admin route with manual login
router.get('/reset-admin', async (req, res) => {
  try {
    // Delete existing admin if any
    await User.deleteMany({ role: 'admin' });
    
    // Create fresh admin user with manual password hash
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    // Skip the pre-save hook by using insertOne
    await User.collection.insertOne({
      username: 'admin',
      email: 'admin@devnote.com',
      password: hashedPassword,
      role: 'admin',
      avatar: '',
      bio: '',
      followers: [],
      following: [],
      readingList: [],
      newsletterSubscription: false,
      subscription: {
        plan: 'free'
      },
      earnings: {
        totalTips: 0,
        sponsoredPosts: 0,
        withdrawable: 0
      },
      readingHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Test login immediately
    const testAdmin = await User.findOne({ email: 'admin@devnote.com' });
    const isMatch = await testAdmin.comparePassword('admin123');
    
    res.json({ 
      message: 'Admin user reset and created successfully',
      credentials: {
        email: 'admin@devnote.com',
        password: 'admin123'
      },
      passwordTest: isMatch
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting admin', error: error.message });
  }
});

// One-time admin setup route
router.get('/create-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin user (password will be hashed by User model pre-save hook)
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    
    res.json({ 
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@devnote.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

module.exports = router;