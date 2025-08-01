import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Touchable, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { COLORS } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const { authState, logout } = useAuth();
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
  console.log('ProfileScreen userData:', userData);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={{ uri: userData?.avatar || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.title}>{userData?.username || 'User Profile'}</Text>
        <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>
          {userData?.email || 'No email provided'}
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <TouchableOpacity style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}  onPress={() => console.log('Edit Profile Pressed')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10,gap: 10 }}>
            <Icon name="user" size={20} color={COLORS.primary} />
            <Text style={{ color: COLORS.text }}>Personal Data</Text>
          </View>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => console.log('Help Pressed')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
            <Icon name="circle-question" size={20} color={COLORS.primary} />
            <Text style={{ color: COLORS.text }}>Help</Text>
          </View>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => console.log('Delete Account Pressed')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
            <Icon name="trash-can" size={20} color={COLORS.primary}  />
            <Text style={{ color: COLORS.text }}>Delete Account</Text>
          </View>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => logout()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
            <Icon name="sign-out" size={20} color={'red'} />
            <Text style={{ color: 'red' }}>Log out</Text>
          </View>
          <Icon name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    fontFamily: 'Rubik-SemiBold',
  },
  profileInfo: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: COLORS.text,
  },
  value: {
    marginBottom: 10,
  },
});

export default ProfileScreen;