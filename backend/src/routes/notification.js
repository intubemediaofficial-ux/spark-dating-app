const express = require('express');
const router = express.Router();
const { registerFCMToken } = require('../services/notificationService');
const { authenticate } = require('../middleware/auth');

// Register FCM token
router.post('/register-token', authenticate, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token is required' });
    }
    await registerFCMToken(req.user.id, fcmToken);
    res.json({ success: true });
  } catch (error) {
    console.error('Register token error:', error);
    res.status(500).json({ error: 'Failed to register token' });
  }
});

module.exports = router;
