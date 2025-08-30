const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DevNote API is running!',
    timestamp: new Date().toISOString()
  });
});

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API Test Successful!',
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;