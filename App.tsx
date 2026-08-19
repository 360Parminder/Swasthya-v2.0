import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { ConnectionProvider } from './src/context/ConnectionContext';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail: _detail }) => {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    // Handle background notification press if needed
  }
});

import { getMessaging } from '@react-native-firebase/messaging';

const App = () => {
  React.useEffect(() => {
    import('./src/services/notificationService').then(({ notificationService }) => {
      notificationService.requestPermissions();
      notificationService.syncFcmToken();
    });

    // Foreground FCM push listener
    let unsubscribeFCM = () => {};
    try {
      unsubscribeFCM = getMessaging().onMessage(async (remoteMessage) => {
        console.log('[FCM] Message received in foreground:', remoteMessage);
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
    } catch (err) {
      console.warn('[FCM] Could not initialize foreground listener:', err?.message);
    }

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        const payload = detail.notification?.data;
        if (payload?.action === 'medication_alarm') {
          // Navigation logic handled if needed
        }
      }
    });

    return () => {
      unsubscribeFCM();
      unsubscribeNotifee();
    };
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? "#000000" : "#F9FAFB"} 
        translucent={false}
      />
      <AuthProvider>
        <ConnectionProvider>
          <AppNavigator />
        </ConnectionProvider>
      </AuthProvider>
      <Toast
        config={toastConfig}
        position="top"
        topOffset={55}
        visibilityTime={3500}
      />
    </SafeAreaProvider>
  );
};

export default App;