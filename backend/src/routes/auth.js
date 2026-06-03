const express = require('express');
const router = express.Router();
const { register, loginWithPhone, loginWithFirebase, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login/phone', loginWithPhone);
router.post('/login/firebase', loginWithFirebase);
router.get('/me', authenticate, getMe);

module.exports = router;
