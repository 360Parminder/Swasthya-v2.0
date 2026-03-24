import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { ConnectionProvider } from './src/context/ConnectionContext';
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
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

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <ConnectionProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </ConnectionProvider>
      </AuthProvider>
      <Toast
        config={toastConfig}
        // ref={(ref) => Toast.setRef(ref)} 
        position="top" // Optional: position can be 'top' (default) or 'bottom'
        topOffset={100} // Optional: adjust if your status bar overlaps
        visibilityTime={5000} // Optional: default is 4000ms
      />
    </SafeAreaProvider>
  );
};

export default App;