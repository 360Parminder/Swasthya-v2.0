import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { ConnectionProvider } from './src/context/ConnectionContext';

const App = () => {
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
        topOffset={50} // Optional: adjust if your status bar overlaps
        visibilityTime={5000} // Optional: default is 4000ms
      />
    </SafeAreaProvider>
  );
};

export default App;