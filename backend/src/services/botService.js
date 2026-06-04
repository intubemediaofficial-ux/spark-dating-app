/**
 * MatchKar Bot Behavior Service
 * 
 * Handles:
 * 1. Auto-like: Bots randomly like 30-40% of new real user profiles
 * 2. Auto-reply: Bots send pre-written replies in chat (max 3-4 messages, then stop)
 * 3. Scheduled tasks to keep bots appearing active
 */

const prisma = require('../config/database');

// Pre-written bot reply messages (natural conversation flow)
const BOT_REPLIES = {
  greeting: [
    'Hey! How are you? 😊',
    'Hi there! Nice to match with you!',
    'Hello! Love your profile ❤️',
    'Hey! What\'s up?',
    'Hi! You seem really interesting 😊',
    'Hey! How\'s your day going?',
    'Hello! Great to connect with you!',
    'Hey there! 👋',
    'Hi! I liked your bio 😄',
    'Hey! Finally a good match! 😊',
  ],
  followUp: [
    'So what do you do? 😊',
    'Where are you from?',
    'What are your hobbies?',
    'Tell me more about yourself!',
    'What do you like to do for fun?',
    'Are you from around here?',
    'What kind of music do you like? 🎵',
    'Have you been to any good restaurants lately? 🍕',
    'What are you looking for on here?',
    'Do you like traveling? ✈️',
  ],
  reply2: [
    'That sounds really cool! 😊',
    'Oh nice! I love that!',
    'Wow, that\'s interesting!',
    'Haha, same here! 😄',
    'That\'s awesome!',
    'Oh really? Tell me more!',
    'I totally agree! 👌',
    'Nice! We have a lot in common 😊',
  ],
  reply3: [
    'By the way, I\'m a bit busy right now. Let\'s chat later? 😊',
    'Hey, gotta run for now! Talk soon? ❤️',
    'I\'ll message you later, ok? Have a great day! 😊',
    'Sorry, heading out now. Chat tomorrow? 🙂',
    'Got to go! But I\'d love to continue this chat later 😊',
  ],
};

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/**
 * Auto-like a new user's profile from random bots.
 * Called when a new user registers — picks 30-40% of nearby bots and creates RIGHT swipes.
 */
async function botAutoLike(newUserId) {
  try {
    const newUser = await prisma.user.findUnique({ where: { id: newUserId } });
    if (!newUser || newUser.isBot) return; // Don't auto-like other bots

    // Find bots that match the user's preferences
    const genderFilter = newUser.genderPreference === 'EVERYONE'
      ? {}
      : { gender: newUser.genderPreference };

    const bots = await prisma.user.findMany({
      where: {
        isBot: true,
        isActive: true,
        ...genderFilter,
      },
      select: { id: true },
    });

    if (bots.length === 0) return;

    // Pick 30-40% of bots to like this user
    const likePercentage = randomInt(30, 40) / 100;
    const numLikes = Math.max(1, Math.floor(bots.length * likePercentage));
    const shuffledBots = [...bots].sort(() => Math.random() - 0.5);
    const selectedBots = shuffledBots.slice(0, numLikes);

    // Stagger the likes so they don't all happen at once
    for (let i = 0; i < selectedBots.length; i++) {
      const bot = selectedBots[i];
      const delayMs = randomInt(5000, 300000); // 5 seconds to 5 minutes delay

      setTimeout(async () => {
        try {
          // Create swipe from bot → new user
          await prisma.swipe.create({
            data: {
              swiperId: bot.id,
              swipedId: newUserId,
              direction: 'RIGHT',
            },
          });
        } catch (e) {
          // Skip duplicates silently
        }
      }, delayMs);
    }

    console.log(`🤖 Bot auto-like: ${selectedBots.length} bots will like user ${newUserId}`);
  } catch (error) {
    console.error('Bot auto-like error:', error.message);
  }
}

/**
 * Check if a match involves a bot and trigger auto-reply flow.
 * Called when a new match is created.
 */
async function botAutoReplyOnMatch(matchId) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: { select: { id: true, isBot: true, name: true } },
        user2: { select: { id: true, isBot: true, name: true } },
      },
    });

    if (!match) return;

    const botUser = match.user1.isBot ? match.user1 : match.user2.isBot ? match.user2 : null;
    if (!botUser) return; // No bot in this match

    // Send first greeting after 1-5 minutes
    const greetingDelay = randomInt(60000, 300000);
    setTimeout(async () => {
      try {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: botUser.id,
            content: randomItem(BOT_REPLIES.greeting),
            type: 'TEXT',
          },
        });
        console.log(`🤖 Bot ${botUser.name} sent greeting in match ${matchId}`);
      } catch (e) {
        // Ignore errors
      }
    }, greetingDelay);
  } catch (error) {
    console.error('Bot auto-reply on match error:', error.message);
  }
}

/**
 * Handle bot reply when a real user sends a message.
 * Bot replies up to 3 times, then goes silent.
 */
async function botReplyToMessage(matchId, realUserId) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: { select: { id: true, isBot: true } },
        user2: { select: { id: true, isBot: true } },
      },
    });

    if (!match) return;

    const botUser = match.user1.isBot ? match.user1 : match.user2.isBot ? match.user2 : null;
    if (!botUser) return;
    if (botUser.id === realUserId) return; // Real user is sending, bot should reply

    // Count how many messages the bot has sent
    const botMessageCount = await prisma.message.count({
      where: { matchId, senderId: botUser.id },
    });

    // Bot stops replying after 4 messages
    if (botMessageCount >= 4) return;

    // Pick reply based on how many messages bot has sent
    let replyPool;
    if (botMessageCount === 0) replyPool = BOT_REPLIES.greeting;
    else if (botMessageCount === 1) replyPool = BOT_REPLIES.followUp;
    else if (botMessageCount === 2) replyPool = BOT_REPLIES.reply2;
    else replyPool = BOT_REPLIES.reply3;

    // Reply after a realistic delay (30 seconds to 3 minutes)
    const replyDelay = randomInt(30000, 180000);
    setTimeout(async () => {
      try {
        await prisma.message.create({
          data: {
            matchId,
            senderId: botUser.id,
            content: randomItem(replyPool),
            type: 'TEXT',
          },
        });
        console.log(`🤖 Bot replied in match ${matchId} (message #${botMessageCount + 1})`);
      } catch (e) {
        // Ignore errors
      }
    }, replyDelay);
  } catch (error) {
    console.error('Bot reply error:', error.message);
  }
}

/**
 * Refresh bot lastActive timestamps so they appear recently active.
 * Run this as a cron job every few hours.
 */
async function refreshBotActivity() {
  try {
    const botCount = await prisma.user.count({ where: { isBot: true } });
    // Update ~30% of bots to appear recently active
    const updateCount = Math.floor(botCount * 0.3);
    
    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { id: true },
      take: updateCount,
      orderBy: { lastActive: 'asc' }, // Update least recently active first
    });

    for (const bot of bots) {
      await prisma.user.update({
        where: { id: bot.id },
        data: { lastActive: new Date(Date.now() - randomInt(0, 7200000)) }, // Within last 2 hours
      });
    }

    console.log(`🤖 Refreshed ${bots.length} bot activity timestamps`);
  } catch (error) {
    console.error('Refresh bot activity error:', error.message);
  }
}

module.exports = {
  botAutoLike,
  botAutoReplyOnMatch,
  botReplyToMessage,
  refreshBotActivity,
};
