const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getSubscription, getPlans } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Public
router.get('/plans', getPlans);

// Authenticated
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/subscription', authenticate, getSubscription);

module.exports = router;
