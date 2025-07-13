import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = () => {
  const { authState, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {authState.user?.name || 'User'}!</Text>
      <Text style={styles.subtitle}>You're logged in successfully.</Text>
      
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default HomeScreen;