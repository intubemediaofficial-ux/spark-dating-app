const prisma = require('../config/database');
const crypto = require('crypto');

// Plan pricing in paise
const PLANS = {
  GOLD: { amount: 19900, name: 'MatchKar Gold', description: 'Unlimited likes, see who liked you' },
  PLATINUM: { amount: 39900, name: 'MatchKar Platinum', description: 'All Gold features + priority likes, super likes, boost' },
};

// Lazy-load Razorpay (only when keys are configured)
function getRazorpay() {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create a subscription order
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body; // 'GOLD' or 'PLATINUM'
    const userId = req.user.id;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Choose GOLD or PLATINUM.' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: 'Payment gateway not configured yet.' });
    }

    const razorpay = getRazorpay();
    const planDetails = PLANS[plan];

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: 'INR',
      receipt: `matchkar_${userId}_${Date.now()}`,
      notes: { userId, plan },
    });

    // Save subscription record
    await prisma.subscription.create({
      data: {
        userId,
        plan,
        razorpayOrderId: order.id,
        amount: planDetails.amount,
        status: 'PENDING',
      },
    });

    res.json({
      orderId: order.id,
      amount: planDetails.amount,
      currency: 'INR',
      planName: planDetails.name,
      description: planDetails.description,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// Verify payment after Razorpay checkout
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    // Update subscription
    const subscription = await prisma.subscription.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'PAID',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    res.json({
      success: true,
      message: `${subscription.plan} subscription activated!`,
      subscription: {
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Get user's active subscription
const getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'PAID',
        endDate: { gt: new Date() },
      },
      orderBy: { endDate: 'desc' },
    });

    if (!subscription) {
      return res.json({ plan: 'FREE', isPremium: false });
    }

    res.json({
      plan: subscription.plan,
      isPremium: true,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      autoRenew: subscription.autoRenew,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
};

// Get plan details (no auth required)
const getPlans = async (req, res) => {
  res.json({
    plans: [
      { id: 'FREE', name: 'Free', price: 0, features: ['20 likes/day', 'Basic filters', 'Chat with matches'] },
      { id: 'GOLD', name: 'MatchKar Gold', price: 199, priceInPaise: 19900, features: ['Unlimited likes', 'See who liked you', 'Advanced filters', '1 Boost/month', 'No ads'] },
      { id: 'PLATINUM', name: 'MatchKar Platinum', price: 399, priceInPaise: 39900, features: ['All Gold features', 'Priority likes', '5 Super Likes/day', '1 Boost/week', 'Profile badge', 'Read receipts'] },
    ],
  });
};

module.exports = { createOrder, verifyPayment, getSubscription, getPlans };
