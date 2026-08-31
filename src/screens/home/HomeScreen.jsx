import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  StatusBar,
  useColorScheme
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useThemeColors } from '../../components/ui/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDayAndDate } from '../../utils/date';
import MedicationScheduleCard from '../../components/home/MedicationScheduleCard';
import { dashboardApi } from '../../api/dashboard';
import { connectionApi } from '../../api/connectionApi';
import { notificationService } from '../../services/notificationService';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Notification01Icon,
  Pulse01Icon,
  DropletIcon,
  Moon02Icon,
  FavouriteIcon,
  UserGroupIcon
} from '@hugeicons/core-free-icons';

// ─── Heart Rate Card ────────────────────────────────────────────────
const HeartRateCard = ({ isDarkMode }) => (
  <View style={[cardStyles.card, isDarkMode ? cardStyles.cardDark : cardStyles.cardLight]}>
    <View style={cardStyles.cardHeaderRow}>
      <View style={cardStyles.titleWithIcon}>
        <HugeiconsIcon icon={FavouriteIcon} size={16} color="#EF4444" />
        <Text style={[cardStyles.cardTitle, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
          HEART RATE
        </Text>
      </View>
      <View style={cardStyles.liveBadge}>
        <View style={cardStyles.liveDot} />
        <Text style={cardStyles.liveText}>LIVE</Text>
      </View>
    </View>

    <View style={cardStyles.valueRow}>
      <Text style={[cardStyles.largeValue, isDarkMode ? cardStyles.textWhite : cardStyles.textBlack]}>72</Text>
      <Text style={[cardStyles.unitText, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}> bpm</Text>
    </View>

    <View style={[cardStyles.statusFooterPill, isDarkMode ? cardStyles.subCardDark : cardStyles.subCardLight]}>
      <HugeiconsIcon icon={Pulse01Icon} size={15} color="#10B981" />
      <Text style={cardStyles.statusSuccessText}>Resting rate stable • Normal</Text>
    </View>
  </View>
);

// ─── Sleep Quality Card ──────────────────────────────────────────────
const SleepQualityCard = ({ navigation, isDarkMode }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('SleepDetails')}
    style={[cardStyles.card, isDarkMode ? cardStyles.cardDark : cardStyles.cardLight]}
    activeOpacity={0.88}
  >
    <View style={cardStyles.cardHeaderRow}>
      <View style={cardStyles.titleWithIcon}>
        <HugeiconsIcon icon={Moon02Icon} size={16} color={isDarkMode ? '#93C5FD' : '#2563EB'} />
        <Text style={[cardStyles.cardTitle, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
          SLEEP QUALITY
        </Text>
      </View>
      <Text style={cardStyles.scorePill}>88% OPTIMAL</Text>
    </View>

    <View style={cardStyles.valueRow}>
      <Text style={[cardStyles.largeValue, isDarkMode ? cardStyles.textWhite : cardStyles.textBlack]}>7h 30m</Text>
    </View>
    <Text style={[cardStyles.subDescription, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
      Deep Sleep: 2h 15m • REM: 1h 45m
    </Text>

    <View style={cardStyles.sleepBars}>
      {[16, 22, 42, 28, 24, 20, 36].map((h, i) => (
        <View
          key={i}
          style={[
            cardStyles.sleepBar,
            {
              height: h,
              backgroundColor: i === 2
                ? (isDarkMode ? '#3B82F6' : '#2563EB')
                : (isDarkMode ? '#272730' : '#E5E7EB')
            }
          ]}
        />
      ))}
    </View>
  </TouchableOpacity>
);

// ─── Hydration Card ──────────────────────────────────────────────────
const HydrationCard = ({ hydration, navigation, isDarkMode }) => {
  const total = Number(hydration?.totalIntake) || 0;
  const target = Number(hydration?.intakeTarget) || 2500;
  const pct = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;
  const displayLiters = (total / 1000).toFixed(2);
  const targetLiters = (target / 1000).toFixed(1);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Hydration')}
      style={[cardStyles.card, isDarkMode ? cardStyles.cardDark : cardStyles.cardLight]}
      activeOpacity={0.88}
    >
      <View style={cardStyles.cardHeaderRow}>
        <View style={cardStyles.titleWithIcon}>
          <HugeiconsIcon icon={DropletIcon} size={16} color="#0284C7" />
          <Text style={[cardStyles.cardTitle, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
            HYDRATION
          </Text>
        </View>
        <View style={[cardStyles.pillBadge, { backgroundColor: isDarkMode ? 'rgba(2, 132, 199, 0.15)' : '#E0F2FE' }]}>
          <Text style={[cardStyles.pillBadgeText, { color: '#0284C7' }]}>{pct}% OF GOAL</Text>
        </View>
      </View>

      <View style={cardStyles.valueRow}>
        <Text style={[cardStyles.largeValue, isDarkMode ? cardStyles.textWhite : cardStyles.textBlack]}>
          {displayLiters}{' '}
        </Text>
        <Text style={[cardStyles.unitText, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
          / {targetLiters} L
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={[cardStyles.progressTrack, { backgroundColor: isDarkMode ? '#272730' : '#E5E7EB' }]}>
        <View
          style={[
            cardStyles.progressFill,
            { backgroundColor: isDarkMode ? '#38BDF8' : '#0284C7', width: `${pct}%` },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

// ─── Care Network Card ───────────────────────────────────────────────
const CareNetworkCard = ({ navigation, isDarkMode }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Connections')}
    style={[cardStyles.card, isDarkMode ? cardStyles.cardDark : cardStyles.cardLight]}
    activeOpacity={0.88}
  >
    <View style={cardStyles.cardHeaderRow}>
      <View style={cardStyles.titleWithIcon}>
        <HugeiconsIcon icon={UserGroupIcon} size={16} color={isDarkMode ? '#93C5FD' : '#2563EB'} />
        <Text style={[cardStyles.cardTitle, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
          CARE NETWORK
        </Text>
      </View>
      <View style={[cardStyles.pillBadge, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
        <Text style={[cardStyles.pillBadgeText, { color: isDarkMode ? '#93C5FD' : '#2563EB' }]}>3 CONNECTED</Text>
      </View>
    </View>

    <View style={cardStyles.careNetworkContent}>
      <View style={cardStyles.avatarRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/100?img=5' }} style={cardStyles.careAvatar} />
        <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} style={[cardStyles.careAvatar, { marginLeft: -10 }]} />
        <View style={[cardStyles.careMoreAvatar, { marginLeft: -10, backgroundColor: isDarkMode ? '#272730' : '#E5E7EB' }]}>
          <Text style={[cardStyles.careMoreText, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>+1</Text>
        </View>
      </View>

      <View style={cardStyles.careInfo}>
        <Text style={[cardStyles.careName, isDarkMode ? cardStyles.textWhite : cardStyles.textBlack]}>Dr. Sarah Miller</Text>
        <Text style={[cardStyles.careRole, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>Primary Physician • Online</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ─── Blood Pressure Card ─────────────────────────────────────────────
const BloodPressureCard = ({ isDarkMode }) => (
  <View style={[cardStyles.card, isDarkMode ? cardStyles.cardDark : cardStyles.cardLight, { marginBottom: 32 }]}>
    <View style={cardStyles.cardHeaderRow}>
      <Text style={[cardStyles.cardTitle, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
        BLOOD PRESSURE
      </Text>
      <View style={[cardStyles.pillBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
        <Text style={[cardStyles.pillBadgeText, { color: '#10B981' }]}>OPTIMAL</Text>
      </View>
    </View>

    <View style={cardStyles.valueRow}>
      <Text style={[cardStyles.largeValue, isDarkMode ? cardStyles.textWhite : cardStyles.textBlack]}>120/80</Text>
      <Text style={[cardStyles.unitText, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}> mmHg</Text>
    </View>

    <View style={cardStyles.bpFooterRow}>
      <Text style={[cardStyles.bpRangeText, isDarkMode ? cardStyles.textMutedDark : cardStyles.textMutedLight]}>
        Normal systolic & diastolic range
      </Text>
    </View>
  </View>
);

// ─── Main HomeScreen Component ──────────────────────────────────────
const HomeScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [medications, setMedications] = useState([]);
  const [hydrationData, setHydrationData] = useState(null);
  const [hasPendingInvites, setHasPendingInvites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getDashboardData();
      const meds = response?.data?.data?.medication;
      const validMeds = meds && meds.length > 0 ? meds : [];
      setMedications(validMeds);
      if (validMeds.length > 0) {
        notificationService.syncMedicationReminders(validMeds);
      }

      // Sync live hydration data
      const hydration = response?.data?.data?.hydration;
      if (hydration) {
        setHydrationData(hydration);
      }

      // Check for pending care circle invites
      try {
        const pendingRes = await connectionApi.viewPending();
        const pendingList =
          pendingRes?.data?.connections ||
          pendingRes?.data?.requests ||
          pendingRes?.data?.data ||
          [];
        setHasPendingInvites(Array.isArray(pendingList) && pendingList.length > 0);
      } catch (err) {
        console.log('Error checking pending invites in home:', err?.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  const { day, date } = getDayAndDate();
  const displayName = authState?.user?.name || 'Member';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#F9FAFB' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#F9FAFB'}
      />

      {/* Modern Clean Header */}
      <View style={[styles.headerWrapper, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: authState?.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={[styles.profileAvatar, { borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB' }]}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.greetingText, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
                Welcome back,
              </Text>
              <Text style={[styles.userNameText, { color: isDarkMode ? '#FFFFFF' : '#111827' }]} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={[
              styles.notificationButton,
              {
                backgroundColor: isDarkMode ? '#121217' : '#FFFFFF',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB',
                position: 'relative',
              }
            ]}
            activeOpacity={0.8}
          >
            <HugeiconsIcon icon={Notification01Icon} size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
            {hasPendingInvites && (
              <View
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#EF4444',
                  borderWidth: 1.5,
                  borderColor: isDarkMode ? '#121217' : '#FFFFFF',
                }}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Date Badge Row */}
        <View style={styles.datePillRow}>
          <View style={[styles.datePill, { backgroundColor: isDarkMode ? '#121217' : '#FFFFFF', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB' }]}>
            <Text style={[styles.datePillText, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
              📅 {day}, {date}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Dashboard Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#3B82F6' : '#2563EB'}
          />
        }
      >
        {/* Medication Schedule Card */}
        <MedicationScheduleCard medications={medications} />

        {/* Vital Health Metrics Cards */}
        <HeartRateCard isDarkMode={isDarkMode} />

        <SleepQualityCard navigation={navigation} isDarkMode={isDarkMode} />

        <HydrationCard hydration={hydrationData} navigation={navigation} isDarkMode={isDarkMode} />

        <CareNetworkCard navigation={navigation} isDarkMode={isDarkMode} />

        <BloodPressureCard isDarkMode={isDarkMode} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    textTransform: 'capitalize',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  datePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePill: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  largeValue: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subDescription: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  subCardDark: {
    backgroundColor: '#1A1A22',
  },
  subCardLight: {
    backgroundColor: '#F3F4F6',
  },
  statusFooterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  statusSuccessText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  sleepBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 48,
    marginTop: 4,
  },
  sleepBar: {
    flex: 1,
    borderRadius: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  careNetworkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  careAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  careMoreAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  careMoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
  careInfo: {
    flex: 1,
  },
  careName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  careRole: {
    fontSize: 13,
    fontWeight: '500',
  },
  bpFooterRow: {
    marginTop: 4,
  },
  bpRangeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  textWhite: { color: '#FFFFFF' },
  textBlack: { color: '#111827' },
  textMutedDark: { color: '#A1A1AA' },
  textMutedLight: { color: '#6B7280' },
});
