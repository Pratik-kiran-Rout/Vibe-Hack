const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Reset and create admin route
router.get('/reset-admin', async (req, res) => {
  try {
    // Delete existing admin if any
    await User.deleteMany({ role: 'admin' });
    
    // Create fresh admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@devnote.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    
    res.json({ 
      message: 'Admin user reset and created successfully',
      credentials: {
        email: 'admin@devnote.com',
        password: 'admin123'
      }
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