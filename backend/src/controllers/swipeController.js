const prisma = require('../config/database');
const { calculateDistance } = require('../utils/helpers');

// Get discovery feed (profiles to swipe on)
const getDiscoveryFeed = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;

    // Get IDs of users already swiped
    const swipedUserIds = await prisma.swipe.findMany({
      where: { swiperId: user.id },
      select: { swipedId: true },
    });
    const swipedIds = swipedUserIds.map(s => s.swipedId);

    // Get blocked user IDs
    const blockedUsers = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: user.id },
          { blockedId: user.id },
        ],
      },
    });
    const blockedIds = blockedUsers.map(b => b.blockerId === user.id ? b.blockedId : b.blockerId);

    // Exclude self + already swiped + blocked
    const excludeIds = [user.id, ...swipedIds, ...blockedIds];

    // Build gender filter
    let genderFilter = {};
    if (user.genderPreference !== 'EVERYONE') {
      genderFilter = { gender: user.genderPreference };
    }

    // Fetch potential matches
    const profiles = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        isActive: true,
        isBanned: false,
        age: { gte: user.minAgePreference, lte: user.maxAgePreference },
        ...genderFilter,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        photos: true,
        interests: true,
        city: true,
        latitude: true,
        longitude: true,
        isVerified: true,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { lastActive: 'desc' },
    });

    // Filter by distance if user has location
    let filteredProfiles = profiles;
    if (user.latitude && user.longitude) {
      filteredProfiles = profiles
        .map(profile => {
          if (profile.latitude && profile.longitude) {
            const distance = calculateDistance(
              user.latitude, user.longitude,
              profile.latitude, profile.longitude
            );
            return { ...profile, distance: Math.round(distance) };
          }
          return { ...profile, distance: null };
        })
        .filter(p => p.distance === null || p.distance <= user.maxDistance);
    }

    res.json({ profiles: filteredProfiles });
  } catch (error) {
    console.error('Discovery feed error:', error);
    res.status(500).json({ error: 'Failed to get discovery feed' });
  }
};

// Swipe on a user
const swipe = async (req, res) => {
  try {
    const { targetUserId, direction } = req.body;
    const userId = req.user.id;

    if (userId === targetUserId) {
      return res.status(400).json({ error: 'Cannot swipe on yourself' });
    }

    // Check if already swiped
    const existingSwipe = await prisma.swipe.findUnique({
      where: { swiperId_swipedId: { swiperId: userId, swipedId: targetUserId } },
    });

    if (existingSwipe) {
      return res.status(400).json({ error: 'Already swiped on this user' });
    }

    // Create swipe
    const swipeRecord = await prisma.swipe.create({
      data: {
        swiperId: userId,
        swipedId: targetUserId,
        direction: direction.toUpperCase(),
      },
    });

    let match = null;

    // Check for mutual like (match)
    if (direction.toUpperCase() === 'RIGHT') {
      const mutualSwipe = await prisma.swipe.findFirst({
        where: {
          swiperId: targetUserId,
          swipedId: userId,
          direction: 'RIGHT',
        },
      });

      if (mutualSwipe) {
        // Create match (sort IDs to avoid duplicates)
        const [user1Id, user2Id] = [userId, targetUserId].sort();
        match = await prisma.match.create({
          data: { user1Id, user2Id },
        });
      }
    }

    res.json({
      swipe: swipeRecord,
      match,
      isMatch: !!match,
    });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ error: 'Swipe failed' });
  }
};

// Get matches
const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
        isActive: true,
      },
      include: {
        user1: {
          select: { id: true, name: true, age: true, photos: true, city: true, isVerified: true },
        },
        user2: {
          select: { id: true, name: true, age: true, photos: true, city: true, isVerified: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format matches to show the other user
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;
      return {
        matchId: match.id,
        user: otherUser,
        lastMessage: match.messages[0] || null,
        createdAt: match.createdAt,
      };
    });

    res.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
};

module.exports = { getDiscoveryFeed, swipe, getMatches };
