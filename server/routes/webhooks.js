const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// In-memory webhook storage (use database in production)
let webhooks = [];

// Get user's webhooks
router.get('/', auth, (req, res) => {
  const userWebhooks = webhooks.filter(w => w.userId === req.user._id.toString());
  res.json(userWebhooks);
});

// Create new webhook
router.post('/', auth, (req, res) => {
  try {
    const { url, events } = req.body;
    
    const webhook = {
      _id: Date.now().toString(),
      userId: req.user._id.toString(),
      url,
      events,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    webhooks.push(webhook);
    res.status(201).json(webhook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create webhook', error: error.message });
  }
});

// Update webhook
router.patch('/:id', auth, (req, res) => {
  try {
    const webhookIndex = webhooks.findIndex(w => 
      w._id === req.params.id && w.userId === req.user._id.toString()
    );
    
    if (webhookIndex === -1) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    webhooks[webhookIndex] = { ...webhooks[webhookIndex], ...req.body };
    res.json(webhooks[webhookIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update webhook', error: error.message });
  }
});

// Delete webhook
router.delete('/:id', auth, (req, res) => {
  try {
    const webhookIndex = webhooks.findIndex(w => 
      w._id === req.params.id && w.userId === req.user._id.toString()
    );
    
    if (webhookIndex === -1) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    webhooks.splice(webhookIndex, 1);
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete webhook', error: error.message });
  }
});

// Trigger webhook function
async function triggerWebhooks(event, data) {
  const activeWebhooks = webhooks.filter(w => 
    w.active && w.events.includes(event)
  );
  
  for (const webhook of activeWebhooks) {
    try {
      await axios.post(webhook.url, {
        event,
        data,
        timestamp: new Date().toISOString(),
        webhook_id: webhook._id
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DevNote-Webhook/1.0'
        }
      });
    } catch (error) {
      console.error(`Webhook ${webhook._id} failed:`, error.message);
    }
  }
}

module.exports = { router, triggerWebhooks };