const prisma = require('../config/database');

// Report a user
const reportUser = async (req, res) => {
  try {
    const { reportedId, reason, description } = req.body;
    const reporterId = req.user.id;

    if (reporterId === reportedId) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedId,
        reason,
        description,
      },
    });

    res.status(201).json({ report, message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

// Block a user
const blockUser = async (req, res) => {
  try {
    const { blockedId } = req.body;
    const blockerId = req.user.id;

    if (blockerId === blockedId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Create block
    await prisma.block.create({
      data: { blockerId, blockedId },
    });

    // Deactivate any existing match
    const [user1Id, user2Id] = [blockerId, blockedId].sort();
    await prisma.match.updateMany({
      where: { user1Id, user2Id },
      data: { isActive: false },
    });

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'User already blocked' });
    }
    console.error('Block error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const { blockedId } = req.body;
    const blockerId = req.user.id;

    await prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

// Get blocked users
const getBlockedUsers = async (req, res) => {
  try {
    const blocks = await prisma.block.findMany({
      where: { blockerId: req.user.id },
      include: {
        blocked: {
          select: { id: true, name: true, photos: true },
        },
      },
    });

    res.json({ blockedUsers: blocks.map(b => b.blocked) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blocked users' });
  }
};

module.exports = { reportUser, blockUser, unblockUser, getBlockedUsers };
