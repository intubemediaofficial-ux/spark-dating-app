const prisma = require('../config/database');
const { generateToken } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, age, gender, phone, email, bio, interests, latitude, longitude, city } = req.body;

    if (age < 18) {
      return res.status(400).json({ error: 'Must be 18 or older to register' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(phone ? [{ phone }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone or email' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        age,
        gender,
        phone,
        email,
        bio: bio || '',
        interests: interests || [],
        latitude,
        longitude,
        city,
      },
    });

    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login with phone (OTP simulation for MVP)
const loginWithPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Login with Firebase token (Google Sign-In)
const loginWithFirebase = async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;

    let user = await prisma.user.findUnique({ where: { firebaseUid } });

    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link Firebase UID to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid },
        });
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please complete registration.', needsRegistration: true });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = { register, loginWithPhone, loginWithFirebase, getMe };
