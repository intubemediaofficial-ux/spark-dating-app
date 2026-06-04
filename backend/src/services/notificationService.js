/**
 * MatchKar Push Notification Service (Firebase Cloud Messaging)
 * 
 * Sends push notifications for:
 * - New match
 * - New message
 * - Someone liked your profile (premium feature)
 * - Boost results
 */

const prisma = require('../config/database');

// Lazy-load Firebase Admin SDK
let firebaseAdmin = null;
function getFirebaseAdmin() {
  if (firebaseAdmin) return firebaseAdmin;
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
    firebaseAdmin = admin;
    return firebaseAdmin;
  } catch (e) {
    console.warn('Firebase not configured — push notifications disabled');
    return null;
  }
}

/**
 * Store FCM token for a user (called when app registers for notifications).
 */
async function registerFCMToken(userId, fcmToken) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  } catch (error) {
    console.error('Failed to register FCM token:', error.message);
  }
}

/**
 * Send push notification to a user.
 */
async function sendPushNotification(userId, title, body, data = {}) {
  try {
    const admin = getFirebaseAdmin();
    if (!admin) return;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) return;

    await admin.messaging().send({
      token: user.fcmToken,
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'matchkar_notifications',
        },
      },
    });
  } catch (error) {
    // Token might be invalid — skip silently
    if (error.code === 'messaging/registration-token-not-registered') {
      await prisma.user.update({ where: { id: userId }, data: { fcmToken: null } }).catch(() => {});
    }
  }
}

/**
 * Notify user of a new match.
 */
async function notifyNewMatch(userId, matchedUserName) {
  await sendPushNotification(
    userId,
    'New Match! 🎉',
    `You and ${matchedUserName} liked each other! Start chatting now.`,
    { type: 'NEW_MATCH' }
  );
}

/**
 * Notify user of a new message.
 */
async function notifyNewMessage(userId, senderName, messagePreview) {
  const preview = messagePreview.length > 50 ? messagePreview.substring(0, 47) + '...' : messagePreview;
  await sendPushNotification(
    userId,
    `${senderName}`,
    preview,
    { type: 'NEW_MESSAGE' }
  );
}

/**
 * Notify user that someone liked their profile (premium only).
 */
async function notifyNewLike(userId) {
  await sendPushNotification(
    userId,
    'Someone likes you! ❤️',
    'Open MatchKar to see who liked your profile.',
    { type: 'NEW_LIKE' }
  );
}

module.exports = {
  registerFCMToken,
  sendPushNotification,
  notifyNewMatch,
  notifyNewMessage,
  notifyNewLike,
};
