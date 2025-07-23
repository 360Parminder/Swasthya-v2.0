import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

const ProfileScreen = () => {
  const { authState } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authApi.getUser();
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData?.username || 'N/A'}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData?.email || 'N/A'}</Text>
        
        <Text style={styles.label}>Member Since:</Text>
        <Text style={styles.value}>
          {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileInfo: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
  },
});

export default ProfileScreen;