import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { COLORS } from '../components/ui/colors';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Swasthya</Text> */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default SplashScreen;