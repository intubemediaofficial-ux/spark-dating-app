const express = require('express');
const router = express.Router();
const { reportUser, blockUser, unblockUser, getBlockedUsers } = require('../controllers/safetyController');
const { authenticate } = require('../middleware/auth');

router.post('/report', authenticate, reportUser);
router.post('/block', authenticate, blockUser);
router.post('/unblock', authenticate, unblockUser);
router.get('/blocked', authenticate, getBlockedUsers);

module.exports = router;
