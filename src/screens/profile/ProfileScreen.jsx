import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  HelpCircleIcon,
  Delete02Icon,
  Logout02Icon,
  PencilEdit02Icon,
  Calendar01Icon,
  ArrowRight01Icon,
  Restaurant01Icon,
  WeightScale01Icon,
  RulerIcon,
  UserGroupIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  RefreshIcon,
  ShieldSecurityIcon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { formatDate } from '../../utils/formatDate';
import { useThemeColors } from '../../components/ui/colors';
import { showToast } from '../../config/toastConfig';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = isDark ? darkStyles : lightStyles;

  const fetchUserData = useCallback(async () => {
    try {
      const response = await authApi.getUser();
      setUserData(response?.data?.user || response?.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Swasthya account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showToast('info', 'Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your medical records, vitals history, and caregiver links. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            showToast('warning', 'Action Required', 'Please contact support@swasthya.app to finalize account deletion.');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={[styles.loadingText, theme.loadingText]}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userAvatar = userData?.avatar || DEFAULT_AVATAR;
  const userName = userData?.name || userData?.username || 'Patient';
  const userEmail = userData?.email || 'patient@swasthya.app';
  const userMobile = userData?.mobile || 'Not set';
  const userCreatedAt = formatDate(userData?.created_at) || 'Member';
  const userHeight = userData?.height || '170';
  const userWeight = userData?.weight || '68';
  const userDOB = userData?.dob ? formatDate(userData.dob) : 'Not specified';
  const userGender = userData?.gender || 'Not specified';
  const userHeightUnit = (userData?.heightUnit || 'cm').toUpperCase();
  const userWeightUnit = (userData?.weightUnit || 'kg').toUpperCase();
  const userDietaryFocus = userData?.food_preference || userData?.dietaryFocus || 'Standard diet';
  const userCode = userData?.userId || '';

  return (
    <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0B0F19' : '#F8FAFC'}
      />

      {/* ── Top Header ── */}
      <View style={[styles.header, theme.header]}>
        <View>
          <Text style={[styles.headerTitle, theme.headerTitle]}>My Profile</Text>
          <Text style={[styles.headerSubtitle, theme.headerSubtitle]}>
            {userCode ? `User ID: ${userCode}` : 'Health Profile & Preferences'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn, theme.iconBtn]}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={RefreshIcon} size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
      >
        {/* ── Hero Profile Card ── */}
        <View style={[styles.heroCard, theme.heroCard]}>
          <View style={styles.heroAvatarContainer}>
            <Image source={{ uri: userAvatar }} style={styles.heroAvatar} />
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
              <HugeiconsIcon icon={PencilEdit02Icon} size={13} color="#FFFFFF" variant="solid" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroTextCol}>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>ACTIVE PATIENT</Text>
            </View>
            <Text style={[styles.heroName, theme.heroName]} numberOfLines={1}>
              {userName}
            </Text>
            <Text style={[styles.heroEmail, theme.heroEmail]} numberOfLines={1}>
              {userEmail}
            </Text>
            <Text style={[styles.heroJoined, theme.heroJoined]}>
              Member since {userCreatedAt}
            </Text>
          </View>
        </View>

        {/* ── BIOMETRICS 2x2 GRID ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>HEALTH BIOMETRICS</Text>
        </View>

        <View style={styles.biometricsGrid}>
          {/* Weight */}
          <View style={[styles.bioCard, theme.bioCard]}>
            <View style={[styles.bioIconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
              <HugeiconsIcon icon={WeightScale01Icon} size={16} color="#3B82F6" />
            </View>
            <Text style={styles.bioLabel}>WEIGHT</Text>
            <View style={styles.bioValueRow}>
              <Text style={[styles.bioValue, theme.bioValue]}>{userWeight}</Text>
              <Text style={styles.bioUnit}>{userWeightUnit}</Text>
            </View>
          </View>

          {/* Height */}
          <View style={[styles.bioCard, theme.bioCard]}>
            <View style={[styles.bioIconBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
              <HugeiconsIcon icon={RulerIcon} size={16} color="#10B981" />
            </View>
            <Text style={styles.bioLabel}>HEIGHT</Text>
            <View style={styles.bioValueRow}>
              <Text style={[styles.bioValue, theme.bioValue]}>{userHeight}</Text>
              <Text style={styles.bioUnit}>{userHeightUnit}</Text>
            </View>
          </View>

          {/* Gender */}
          <View style={[styles.bioCard, theme.bioCard]}>
            <View style={[styles.bioIconBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
              <HugeiconsIcon icon={UserIcon} size={16} color="#F59E0B" />
            </View>
            <Text style={styles.bioLabel}>GENDER</Text>
            <View style={styles.bioValueRow}>
              <Text style={[styles.bioValue, theme.bioValue, { textTransform: 'capitalize' }]} numberOfLines={1}>
                {userGender}
              </Text>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={[styles.bioCard, theme.bioCard]}>
            <View style={[styles.bioIconBadge, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
              <HugeiconsIcon icon={Calendar01Icon} size={16} color="#8B5CF6" />
            </View>
            <Text style={styles.bioLabel}>DATE OF BIRTH</Text>
            <View style={styles.bioValueRow}>
              <Text style={[styles.bioValue, theme.bioValue, { fontSize: 15 }]} numberOfLines={1}>
                {userDOB}
              </Text>
            </View>
          </View>
        </View>

        {/* ── IDENTITY & CONTACT SECTION ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>IDENTITY & CONTACT</Text>
        </View>

        <View style={[styles.menuCard, theme.menuCard]}>
          {/* Full Name */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconBox, theme.menuIconBox]}>
              <HugeiconsIcon icon={UserIcon} size={16} color="#3B82F6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>FULL NAME</Text>
              <Text style={[styles.menuValue, theme.menuValue]}>{userName}</Text>
            </View>
          </View>
          <View style={[styles.rowDivider, theme.rowDivider]} />

          {/* Email */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconBox, theme.menuIconBox]}>
              <HugeiconsIcon icon={Mail01Icon} size={16} color="#3B82F6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>EMAIL ADDRESS</Text>
              <Text style={[styles.menuValue, theme.menuValue]}>{userEmail}</Text>
            </View>
          </View>
          <View style={[styles.rowDivider, theme.rowDivider]} />

          {/* Mobile */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconBox, theme.menuIconBox]}>
              <HugeiconsIcon icon={SmartPhone01Icon} size={16} color="#3B82F6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>MOBILE NUMBER</Text>
              <Text style={[styles.menuValue, theme.menuValue]}>{userMobile}</Text>
            </View>
          </View>
          <View style={[styles.rowDivider, theme.rowDivider]} />

          {/* Food Preference */}
          <View style={styles.menuRow}>
            <View style={[styles.menuIconBox, theme.menuIconBox]}>
              <HugeiconsIcon icon={Restaurant01Icon} size={16} color="#10B981" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>DIETARY FOCUS</Text>
              <Text style={[styles.menuValue, theme.menuValue, { textTransform: 'capitalize' }]}>
                {userDietaryFocus}
              </Text>
            </View>
            <View style={[styles.pillTag, theme.pillTag]}>
              <Text style={styles.pillTagText}>{userDietaryFocus}</Text>
            </View>
          </View>
        </View>

        {/* ── QUICK ACTIONS & SUPPORT ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>SUPPORT & CONNECTIVITY</Text>
        </View>

        <View style={[styles.menuCard, theme.menuCard]}>
          {/* Help & Support */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('HelpSupport')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
              <HugeiconsIcon icon={HelpCircleIcon} size={18} color="#3B82F6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.navTitle, theme.navTitle]}>Help & Support</Text>
              <Text style={styles.navSubtitle}>Guides, FAQs, live chat & feedback</Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
          <View style={[styles.rowDivider, theme.rowDivider]} />

          {/* Caregiver Network */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('Connections')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
              <HugeiconsIcon icon={UserGroupIcon} size={18} color="#10B981" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.navTitle, theme.navTitle]}>Care Circle & Connections</Text>
              <Text style={styles.navSubtitle}>Manage linked family & caregivers</Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
          <View style={[styles.rowDivider, theme.rowDivider]} />

          {/* Medication History Log */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('MedicationHistory')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
              <HugeiconsIcon icon={Clock01Icon} size={18} color="#8B5CF6" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.navTitle, theme.navTitle]}>Medication History Log</Text>
              <Text style={styles.navSubtitle}>View adherence logs and timeline</Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={isDark ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>
        </View>

        {/* ── ACCOUNT ACTIONS ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>ACCOUNT ACTIONS</Text>
        </View>

        <View style={[styles.menuCard, theme.menuCard]}>
          {/* Delete Account */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
              <HugeiconsIcon icon={Delete02Icon} size={18} color="#EF4444" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.navTitle, { color: '#EF4444' }]}>Delete Account</Text>
              <Text style={styles.navSubtitle}>Permanently remove all medical records</Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* ── LOGOUT BUTTON ── */}
        <TouchableOpacity
          style={[styles.logoutBtn, theme.logoutBtn]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <HugeiconsIcon icon={Logout02Icon} size={18} color="#EF4444" strokeWidth={2} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Base Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Hero Card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    gap: 16,
  },
  heroAvatarContainer: {
    position: 'relative',
  },
  heroAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroTextCol: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#10B981',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    textTransform: 'capitalize',
  },
  heroEmail: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 1,
  },
  heroJoined: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },

  // Section Headers
  sectionHeaderRow: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  // Biometrics Grid
  biometricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  bioCard: {
    width: '48.4%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  bioIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bioLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#94A3B8',
    marginBottom: 4,
  },
  bioValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bioValue: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  bioUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 4,
  },

  // Menu Card List
  menuCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#94A3B8',
    marginBottom: 2,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  navSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    width: '100%',
  },
  pillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pillTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'capitalize',
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});

// ─── Dark Theme Styles ─────────────────────────────────────────────
const darkStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B0F19',
  },
  loadingText: {
    color: '#94A3B8',
  },
  header: {
    backgroundColor: '#0B0F19',
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    color: '#F8FAFC',
  },
  headerSubtitle: {
    color: '#94A3B8',
  },
  iconBtn: {
    backgroundColor: '#161E2E',
    borderColor: '#26334D',
  },
  heroCard: {
    backgroundColor: '#131B2A',
    borderColor: '#1E293B',
  },
  heroName: {
    color: '#F8FAFC',
  },
  heroEmail: {
    color: '#94A3B8',
  },
  heroJoined: {
    color: '#64748B',
  },
  sectionTitle: {
    color: '#64748B',
  },
  bioCard: {
    backgroundColor: '#131B2A',
    borderColor: '#1E293B',
  },
  bioValue: {
    color: '#F8FAFC',
  },
  menuCard: {
    backgroundColor: '#131B2A',
    borderColor: '#1E293B',
  },
  menuIconBox: {
    backgroundColor: '#161E2E',
  },
  menuValue: {
    color: '#F8FAFC',
  },
  navTitle: {
    color: '#F8FAFC',
  },
  rowDivider: {
    backgroundColor: '#1E293B',
  },
  pillTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
});

// ─── Light Theme Styles ────────────────────────────────────────────
const lightStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#64748B',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    color: '#0F172A',
  },
  headerSubtitle: {
    color: '#64748B',
  },
  iconBtn: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroName: {
    color: '#0F172A',
  },
  heroEmail: {
    color: '#64748B',
  },
  heroJoined: {
    color: '#94A3B8',
  },
  sectionTitle: {
    color: '#64748B',
  },
  bioCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  bioValue: {
    color: '#0F172A',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIconBox: {
    backgroundColor: '#EFF6FF',
  },
  menuValue: {
    color: '#0F172A',
  },
  navTitle: {
    color: '#0F172A',
  },
  rowDivider: {
    backgroundColor: '#F1F5F9',
  },
  pillTag: {
    backgroundColor: '#ECFDF5',
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
});

export default ProfileScreen;