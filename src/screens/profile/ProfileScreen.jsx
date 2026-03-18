import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../../api/authApi';
import { COLORS } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const { authState, logout } = useAuth();
  const navigation = useNavigation();
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
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userData?.avatar || 'https://via.placeholder.com/120' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userData?.username || 'User Profile'}</Text>
        <Text style={styles.email}>{userData?.email || 'No email provided'}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Training Time Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFA726' }]}>
            <MaterialIcon name="clock-outline" size={28} color="#fff" />
          </View>
          <Text style={styles.statMainValue}>1 hr 20 mins</Text>
          <Text style={styles.statLabel}>training time</Text>
          <Text style={styles.statSubValue}>600 Kcal</Text>
        </View>

        {/* Calories Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#EF5350' }]}>
            <MaterialIcon name="fire" size={28} color="#fff" />
          </View>
          <Text style={styles.statMainValue}>345 Kcal</Text>
          <Text style={styles.statLabel}>600 Kcal</Text>
          <Text style={styles.statSubValue}></Text>
        </View>

        {/* Exercise Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#5C6BC0' }]}>
            <MaterialIcon name="dumbbell" size={28} color="#fff" />
          </View>
          <Text style={styles.statMainValue}>4 Exercise</Text>
          <Text style={styles.statLabel}>12 Exercise</Text>
          <Text style={styles.statSubValue}></Text>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          console.log('Personal Data Pressed');
          // navigation.navigate('PersonalData');
        }}>
          <View style={styles.menuIconContainer}>
            <MaterialIcon name="account-outline" size={24} color={COLORS.text} />
          </View>
          <Text style={styles.menuItemText}>Personal data</Text>
          <Icon name="chevron-right" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {
          console.log('Help Pressed');
          // navigation.navigate('Help');
        }}>
          <View style={styles.menuIconContainer}>
            <MaterialIcon name="help-circle-outline" size={24} color={COLORS.text} />
          </View>
          <Text style={styles.menuItemText}>Help</Text>
          <Icon name="chevron-right" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => {
          console.log('Delete Account Pressed');
          // navigation.navigate('DeleteAccount');
        }}>
          <View style={styles.menuIconContainer}>
            <MaterialIcon name="trash-can-outline" size={24} color={COLORS.text} />
          </View>
          <Text style={styles.menuItemText}>Delete account</Text>
          <Icon name="chevron-right" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={() => logout()}>
          <View style={styles.menuIconContainer}>
            <MaterialIcon name="logout" size={24} color="#FF5252" />
          </View>
          <Text style={styles.logoutText}>Log out</Text>
          <Icon name="chevron-right" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: COLORS.cardBackground,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statMainValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    marginRight: 12,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutText: {
    flex: 1,
    fontSize: 14,
    color: '#FF5252',
    fontWeight: '500',
  },
});

export default ProfileScreen;