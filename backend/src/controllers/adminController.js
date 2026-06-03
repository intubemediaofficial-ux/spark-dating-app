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

module.exports = { getUsers, toggleBanUser, approveProfile, getReports, resolveReport, getDashboardStats };
