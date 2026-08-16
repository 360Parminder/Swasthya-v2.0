import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { ConnectionProvider } from './src/context/ConnectionContext';
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail: _detail }) => {
  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    // Handle background notification press if needed
  }
});

const App = () => {
  React.useEffect(() => {
    import('./src/services/notificationService').then(({ notificationService }) => {
      notificationService.requestPermissions();
    });

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
        const payload = detail.notification?.data;
        if (payload?.action === 'medication_alarm') {
          // Navigation logic can be handled here or inside index
        }
      }
    });

    return unsubscribe;
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