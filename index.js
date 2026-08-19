/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

// Background notification listener
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM] Message received in background:', remoteMessage);
  if (remoteMessage?.notification) {
    const isInvite = remoteMessage.data?.type === 'care_circle_invite';
    await notifee.displayNotification({
      title: remoteMessage.notification.title || (isInvite ? '🤝 Care Circle Invite' : 'Swasthya Alert'),
      body: remoteMessage.notification.body || '',
      data: remoteMessage.data || {},
      android: {
        channelId: isInvite ? 'care_circle_invites' : 'medication_reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        pressAction: { id: 'default' },
      },
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
