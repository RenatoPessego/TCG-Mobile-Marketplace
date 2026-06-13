const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(pushToken, title, body) { // Send a push notification to the user
  if (!Expo.isExpoPushToken(pushToken)) {
    console.warn('Invalid token:', pushToken);
    return;
  }

  try {
    const messages = [{
      to: pushToken,
      sound: 'default',
      title,
      body,
    }];

    const receipt = await expo.sendPushNotificationsAsync(messages);
  } catch (err) {
    console.error('Error sending notification:', err);
  }
}

module.exports = sendPushNotification;