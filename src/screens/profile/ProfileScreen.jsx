import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Notification03Icon, UserIcon, Mail01Icon, SmartPhone01Icon, 
  Settings02Icon, HelpCircleIcon, Delete02Icon, Logout02Icon, PencilEdit02Icon,
  Calendar01Icon, ArrowRight01Icon, Restaurant01Icon
} from '@hugeicons/core-free-icons';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const ProfileScreen = () => {
  const COLORS = useThemeColors();
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Styling Constants mapping to the design
  const TEAL = COLORS.background === '#121212' ? '#4DB6AC' : '#006A6A';
  const CARD_BG = COLORS.cardBackground;
  const PAGE_BG = COLORS.background;
  
  const styles = React.useMemo(() => getStyles(COLORS, TEAL, CARD_BG, PAGE_BG), [COLORS, TEAL, CARD_BG, PAGE_BG]);

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
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  const userAvatar = userData?.avatar || DEFAULT_AVATAR;
  const userName = userData?.username || 'Elena Richardson';
  const userEmail = userData?.email || 'elena.rich@healthplus.com';
  const userMobile = userData?.mobile || '+1 (555) 0123-4567';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
            <View style={styles.headerLeftAvatarRing}>
                <Image source={{ uri: userAvatar }} style={styles.headerSmallAvatar} />
            </View>
            <Text style={styles.headerTitle}>Health+ Wellness</Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <HugeiconsIcon icon={Notification03Icon} size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Main User Profile Image & Name */}
          <View style={styles.heroSection}>
            <View style={styles.heroAvatarContainer}>
                <Image source={{ uri: userAvatar }} style={styles.heroAvatar} />
                <TouchableOpacity style={styles.editBadge}>
                    <HugeiconsIcon icon={PencilEdit02Icon} size={14} color={TEAL} variant="solid" />
                </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{userName}</Text>
            <Text style={styles.heroSubtitle}>Member since Jan 2024</Text>
          </View>

          {/* IDENTITY SECTION */}
          <Text style={styles.sectionHeader}>IDENTITY</Text>
          <View style={styles.sectionCard}>
            
            <View style={styles.rowItem}>
                <View style={styles.rowIconBox}>
                    <HugeiconsIcon icon={UserIcon} size={20} color={COLORS.healthCardSubtext} variant="solid" />
                </View>
                <View style={styles.rowTextCol}>
                    <Text style={styles.rowLabel}>FULL NAME</Text>
                    <Text style={styles.rowValue}>{userName}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.rowItem}>
                <View style={styles.rowIconBox}>
                    <HugeiconsIcon icon={Mail01Icon} size={20} color={COLORS.healthCardSubtext} variant="solid" />
                </View>
                <View style={styles.rowTextCol}>
                    <Text style={styles.rowLabel}>EMAIL</Text>
                    <Text style={styles.rowValue}>{userEmail}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.rowItem}>
                <View style={styles.rowIconBox}>
                    <HugeiconsIcon icon={SmartPhone01Icon} size={20} color={COLORS.healthCardSubtext} variant="solid" />
                </View>
                <View style={styles.rowTextCol}>
                    <Text style={styles.rowLabel}>MOBILE</Text>
                    <Text style={styles.rowValue}>{userMobile}</Text>
                </View>
            </View>

          </View>

          {/* BIOMETRICS SECTION */}
          <Text style={styles.sectionHeader}>BIOMETRICS</Text>
          <View style={styles.gridContainer}>
            
            <View style={styles.gridCard}>
                <MaterialIcon name="weight" size={22} color={TEAL} />
                <Text style={styles.gridLabel}>WEIGHT</Text>
                <View style={styles.gridValueRow}>
                    <Text style={styles.gridMainValue}>64.5</Text>
                    <Text style={styles.gridSubValue}> KG</Text>
                </View>
            </View>

            <View style={styles.gridCard}>
                <MaterialIcon name="ruler" size={22} color={TEAL} />
                <Text style={styles.gridLabel}>HEIGHT</Text>
                <View style={styles.gridValueRow}>
                    <Text style={styles.gridMainValue}>172</Text>
                    <Text style={styles.gridSubValue}> CM</Text>
                </View>
            </View>

            <View style={styles.gridCard}>
                <MaterialIcon name="gender-female" size={22} color={TEAL} />
                <Text style={styles.gridLabel}>GENDER</Text>
                <View style={styles.gridValueRow}>
                    <Text style={styles.gridMainValue}>Female</Text>
                </View>
            </View>

            <View style={styles.gridCard}>
                <HugeiconsIcon icon={Calendar01Icon} size={22} color={TEAL} variant="solid" />
                <Text style={styles.gridLabel}>DOB</Text>
                <View style={styles.gridValueRow}>
                    <Text style={styles.gridMainValue}>12 May 1992</Text>
                </View>
            </View>

          </View>

          {/* PREFERENCES SECTION */}
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.sectionCard}>
            
            <View style={styles.prefHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <HugeiconsIcon icon={Restaurant01Icon} size={20} color={COLORS.healthCardSubtext} />
                    <Text style={styles.prefHeaderTitle}>Dietary Focus</Text>
                </View>
                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <HugeiconsIcon icon={Settings02Icon} size={18} color={TEAL} variant="solid" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.pillContainer}>
                <View style={[styles.pill, styles.pillActive]}>
                    <Text style={[styles.pillText, styles.pillTextActive]}>Plant-based</Text>
                </View>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>Gluten-free</Text>
                </View>
                <View style={[styles.pill, styles.pillActive]}>
                    <Text style={[styles.pillText, styles.pillTextActive]}>Organic Only</Text>
                </View>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>Low Sodium</Text>
                </View>
            </View>

          </View>

          {/* Links Section */}
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity style={styles.linkCard} onPress={() => {}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.linkIconBox}>
                        <HugeiconsIcon icon={HelpCircleIcon} size={18} color="#FFFFFF" variant="solid" />
                    </View>
                    <Text style={styles.linkText}>Help & Support</Text>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={COLORS.placeholder} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkCard} onPress={() => {}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.linkIconBox, { backgroundColor: '#DC2626' }]}>
                        <HugeiconsIcon icon={Delete02Icon} size={18} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.linkText, { color: '#DC2626' }]}>Delete Account</Text>
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={COLORS.placeholder} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
            <HugeiconsIcon icon={Logout02Icon} size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS, TEAL, CARD_BG, PAGE_BG) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  loadingContainer: {
    backgroundColor: PAGE_BG,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: PAGE_BG,
  },
  headerLeftAvatarRing: {
    borderWidth: 2,
    borderColor: TEAL,
    borderRadius: 18,
    padding: 2,
  },
  headerSmallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEAL,
  },
  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: TEAL,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.healthCardText,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.healthCardSubtext,
  },
  // Utilities & Shared
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280', // Gray mapped conceptually
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  // Identity Rows
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowTextCol: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.healthCardSubtext,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.healthCardText,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  // Biometrics Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  gridCard: {
    width: '48%',
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.healthCardSubtext,
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 4,
  },
  gridValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gridMainValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.healthCardText,
  },
  gridSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.healthCardSubtext,
    marginLeft: 2,
  },
  // Preferences
  prefHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prefHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginLeft: 10,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: CARD_BG,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.healthCardSubtext,
  },
  pillActive: {
    backgroundColor: '#E0F2FE', // Light crisp blue/teal map
    borderColor: '#E0F2FE',
  },
  pillTextActive: {
    color: '#004D40', // Deep teal map
  },
  // Links
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  linkIconBox: {
    backgroundColor: '#374151', // Dark Gray
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.healthCardText,
  },
  // Logout
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#111827', // Almost black
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  }
});

export default ProfileScreen;