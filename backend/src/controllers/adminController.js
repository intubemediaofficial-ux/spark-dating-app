const prisma = require('../config/database');

// Get all users (with pagination)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    let where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    if (status === 'banned') where.isBanned = true;
    if (status === 'active') where.isBanned = false;
    if (status === 'unverified') where.isVerified = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          age: true,
          gender: true,
          photos: true,
          city: true,
          isVerified: true,
          isActive: true,
          isBanned: true,
          profileApproved: true,
          createdAt: true,
          lastActive: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Ban/unban user
const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
    });

    res.json({ user: updatedUser, message: updatedUser.isBanned ? 'User banned' : 'User unbanned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle ban' });
  }
};

// Approve/reject profile
const approveProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileApproved: approved },
    });

    res.json({ user, message: approved ? 'Profile approved' : 'Profile rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve profile' });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { status = 'PENDING', page = 1, limit = 20 } = req.query;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where: { status },
        include: {
          reporter: { select: { id: true, name: true, photos: true } },
          reported: { select: { id: true, name: true, photos: true, email: true, phone: true } },
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.count({ where: { status } }),
    ]);

    res.json({
      reports,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reports' });
  }
};

// Resolve report
const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, banUser } = req.body;

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status, resolvedAt: new Date() },
    });

    // Optionally ban the reported user
    if (banUser) {
      await prisma.user.update({
        where: { id: report.reportedId },
        data: { isBanned: true },
      });
    }

    res.json({ report, message: 'Report resolved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve report' });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalMatches, pendingReports, bannedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true, isBanned: false } }),
      prisma.match.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { isBanned: true } }),
    ]);

    const recentUsers = await prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });

    res.json({
      totalUsers,
      activeUsers,
      totalMatches,
      pendingReports,
      bannedUsers,
      newUsersThisWeek: recentUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

// Get bot profiles
const getBots = async (req, res) => {
  try {
    const { page = 1, gender = 'ALL' } = req.query;
    const limit = 20;

    let where = { isBot: true };
    if (gender !== 'ALL') where.gender = gender;

    const [bots, total, female, male] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (parseInt(page) - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, age: true, gender: true,
          city: true, photos: true, isBot: true,
        },
      }),
      prisma.user.count({ where: { isBot: true } }),
      prisma.user.count({ where: { isBot: true, gender: 'FEMALE' } }),
      prisma.user.count({ where: { isBot: true, gender: 'MALE' } }),
    ]);

    res.json({ bots, stats: { total, female, male } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bots' });
  }
};

// Get settings
const getSettings = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '../../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '');
      }
    });

    res.json({
      razorpayKeyId: envVars.RAZORPAY_KEY_ID || '',
      razorpayKeySecret: envVars.RAZORPAY_KEY_SECRET ? '********' : '',
      firebaseProjectId: envVars.FIREBASE_PROJECT_ID || '',
      firebaseApiKey: envVars.FIREBASE_API_KEY || '',
      cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME || '',
      cloudinaryApiKey: envVars.CLOUDINARY_API_KEY || '',
      cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET ? '********' : '',
      jwtSecret: envVars.JWT_SECRET ? '********' : '',
      corsOrigin: envVars.CORS_ORIGIN || '',
      appName: 'MatchKar',
      dailyLikeLimit: envVars.DAILY_LIKE_LIMIT || '20',
      subscriptionPriceGold: envVars.SUBSCRIPTION_PRICE_GOLD || '199',
      subscriptionPricePlatinum: envVars.SUBSCRIPTION_PRICE_PLATINUM || '399',
      botAutoLikePercentage: envVars.BOT_AUTO_LIKE_PERCENTAGE || '35',
      botReplyDelay: envVars.BOT_REPLY_DELAY || '3',
      maxBotReplies: envVars.MAX_BOT_REPLIES || '4',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '../../.env');
    const settings = req.body;

    // Read current env
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update values (skip masked ones)
    const updates = {
      RAZORPAY_KEY_ID: settings.razorpayKeyId,
      RAZORPAY_KEY_SECRET: settings.razorpayKeySecret,
      FIREBASE_PROJECT_ID: settings.firebaseProjectId,
      FIREBASE_API_KEY: settings.firebaseApiKey,
      CLOUDINARY_CLOUD_NAME: settings.cloudinaryCloudName,
      CLOUDINARY_API_KEY: settings.cloudinaryApiKey,
      CLOUDINARY_API_SECRET: settings.cloudinaryApiSecret,
      JWT_SECRET: settings.jwtSecret,
      CORS_ORIGIN: settings.corsOrigin,
      DAILY_LIKE_LIMIT: settings.dailyLikeLimit,
      SUBSCRIPTION_PRICE_GOLD: settings.subscriptionPriceGold,
      SUBSCRIPTION_PRICE_PLATINUM: settings.subscriptionPricePlatinum,
      BOT_AUTO_LIKE_PERCENTAGE: settings.botAutoLikePercentage,
      BOT_REPLY_DELAY: settings.botReplyDelay,
      MAX_BOT_REPLIES: settings.maxBotReplies,
    };

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === '********') continue;
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }

    fs.writeFileSync(envPath, envContent);
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

// Get subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const stats = {
      totalRevenue: subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0),
      activeSubscriptions: subscriptions.filter(s => s.status === 'ACTIVE').length,
      goldCount: subscriptions.filter(s => s.plan === 'GOLD').length,
      platinumCount: subscriptions.filter(s => s.plan === 'PLATINUM').length,
    };

    res.json({
      subscriptions: subscriptions.map(s => ({
        id: s.id,
        userId: s.userId,
        userName: s.user?.name || 'Unknown',
        plan: s.plan,
        amount: s.amount || 0,
        status: s.status,
        startDate: s.createdAt,
        endDate: s.expiresAt,
      })),
      stats,
    });
  } catch (error) {
    // If subscription table doesn't exist yet, return empty
    res.json({ subscriptions: [], stats: { totalRevenue: 0, activeSubscriptions: 0, goldCount: 0, platinumCount: 0 } });
  }
};

module.exports = { getUsers, toggleBanUser, approveProfile, getReports, resolveReport, getDashboardStats, getBots, getSettings, updateSettings, getSubscriptions };
