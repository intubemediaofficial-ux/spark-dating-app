const prisma = require('../config/database');
const { botReplyToMessage } = require('../services/botService');
const { notifyNewMessage } = require('../services/notificationService');

// Get messages for a match
const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
    });

    if (!match) {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        sender: {
          select: { id: true, name: true, photos: true },
        },
      },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { content, type = 'TEXT' } = req.body;
    const userId = req.user.id;

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        isActive: true,
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
    });

    if (!match) {
      return res.status(403).json({ error: 'Not authorized to send messages in this match' });
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: userId,
        content,
        type,
      },
      include: {
        sender: {
          select: { id: true, name: true, photos: true },
        },
      },
    });

    // Trigger bot auto-reply if match involves a bot
    botReplyToMessage(matchId, userId).catch(() => {});

    // Send push notification to the other user
    const receiverId = match.user1Id === userId ? match.user2Id : match.user1Id;
    const senderName = req.user.name || 'Someone';
    notifyNewMessage(receiverId, senderName, content).catch(() => {});

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = { getMessages, sendMessage };
