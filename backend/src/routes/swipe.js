const express = require('express');
const router = express.Router();
const { getDiscoveryFeed, swipe, getMatches } = require('../controllers/swipeController');
const { authenticate } = require('../middleware/auth');

router.get('/discover', authenticate, getDiscoveryFeed);
router.post('/swipe', authenticate, swipe);
router.get('/matches', authenticate, getMatches);

module.exports = router;
