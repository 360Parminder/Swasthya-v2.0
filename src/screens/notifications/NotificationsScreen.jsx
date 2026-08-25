import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Tick02Icon,
  Cancel01Icon,
  UserGroup03Icon,
  Notification03Icon,
  RefreshIcon,
  DropletIcon,
  Medicine01Icon,
  Moon02Icon,
  SparklesIcon,
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Time02Icon,
  PillIcon,
} from '@hugeicons/core-free-icons';
import { connectionApi } from '../../api/connectionApi';
import { medicationApi } from '../../api/medicationApi';
import { showToast } from '../../config/toastConfig';
import { playTickSound } from '../../services/soundService';
import { useThemeColors } from '../../components/ui/colors';

const { width } = Dimensions.get('window');
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Caregiver&background=random';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [invites, setInvites] = useState([]);
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState({});
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'INVITES' | 'MEDS' | 'SYSTEM'

  // Fetch pending invitations and refill alerts
  const fetchAllNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [invitesRes, refillsRes] = await Promise.allSettled([
        connectionApi.viewPending(),
        medicationApi.getRefillAlerts(),
      ]);

      if (invitesRes.status === 'fulfilled') {
        const rawConnections =
          invitesRes.value?.data?.receivedRequests ||
          invitesRes.value?.data?.connections ||
          invitesRes.value?.data?.requests ||
          [];
        const pendingList = Array.isArray(rawConnections)
          ? rawConnections.filter((item) => item && (item.status === 'pending' || !item.status))
          : [];
        setInvites(pendingList);
      }

      if (refillsRes.status === 'fulfilled' && refillsRes.value?.data?.success) {
        const meds = refillsRes.value.data.medications || [];
        const lowStockMeds = meds.filter(
          (m) => m.stockStatus === 'CRITICAL' || m.stockStatus === 'LOW_STOCK'
        );
        setRefillAlerts(lowStockMeds);
      }
    } catch (error) {
      console.log('Error fetching notification alerts:', error?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  const handleAcceptInvite = async (item) => {
    const senderId = item.senderId || item._id || item.id;
    if (!senderId) return;

    playTickSound();
    setActionInProgress((prev) => ({ ...prev, [senderId]: 'accepting' }));

    try {
      await connectionApi.updateRequest(senderId, 'accepted');
      showToast('success', 'Invite Accepted 🎉', `You are now connected with ${item.name || 'your caregiver'}.`);
      setInvites((prev) => prev.filter((inv) => (inv.senderId || inv._id || inv.id) !== senderId));
    } catch (error) {
      showToast('error', 'Error', error?.response?.data?.message || 'Failed to accept invitation');
    } finally {
      setActionInProgress((prev) => ({ ...prev, [senderId]: null }));
    }
  };

  const handleDeclineInvite = async (item) => {
    const senderId = item.senderId || item._id || item.id;
    if (!senderId) return;

    playTickSound();
    setActionInProgress((prev) => ({ ...prev, [senderId]: 'declining' }));

    try {
      await connectionApi.updateRequest(senderId, 'rejected');
      showToast('info', 'Invite Declined', 'Invitation has been declined.');
      setInvites((prev) => prev.filter((inv) => (inv.senderId || inv._id || inv.id) !== senderId));
    } catch (error) {
      showToast('error', 'Error', error?.response?.data?.message || 'Failed to decline invitation');
    } finally {
      setActionInProgress((prev) => ({ ...prev, [senderId]: null }));
    }
  };

  // System Notifications
  const systemUpdates = useMemo(
    () => [
      {
        id: 'sys-1',
        type: 'HYDRATION',
        title: 'Daily Hydration Target',
        message: 'You are on track with your water intake today. Keep staying hydrated!',
        time: 'Today',
        icon: DropletIcon,
        iconColor: '#3B82F6',
        iconBg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
        route: 'Hydration',
        actionLabel: 'View Water Log',
      },
      {
        id: 'sys-2',
        type: 'SLEEP',
        title: 'Optimal Sleep Schedule',
        message: 'Your bedtime routine starts at 10:45 PM. Dim ambient lights for deep rest.',
        time: 'Tonight',
        icon: Moon02Icon,
        iconColor: '#6366F1',
        iconBg: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF',
        route: 'SleepDetails',
        actionLabel: 'View Routine',
      },
      {
        id: 'sys-3',
        type: 'MEDICATION',
        title: 'Medication Sync Active',
        message: 'Your prescription alarm schedules are synced with smart notifications.',
        time: 'System',
        icon: Medicine01Icon,
        iconColor: '#10B981',
        iconBg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
        route: 'Medication',
        actionLabel: 'View Schedule',
      },
    ],
    [isDark]
  );

  const totalActionsNeeded = invites.length + refillAlerts.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* ── Top Navigation Bar ── */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Notifications & Alerts</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Care Circle & System Updates</Text>
        </View>

        <TouchableOpacity
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={RefreshIcon} size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {/* ── Hero Status Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.heroIconBadge,
                {
                  backgroundColor:
                    totalActionsNeeded > 0
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.15)'
                        : '#EFF6FF'
                      : isDark
                      ? 'rgba(16, 185, 129, 0.15)'
                      : '#ECFDF5',
                },
              ]}
            >
              <HugeiconsIcon
                icon={totalActionsNeeded > 0 ? Notification03Icon : CheckmarkCircle02Icon}
                size={24}
                color={totalActionsNeeded > 0 ? '#3B82F6' : '#10B981'}
                strokeWidth={2.2}
              />
            </View>

            <View style={styles.heroTextCol}>
              <View style={styles.heroLiveBadgeRow}>
                <View
                  style={[
                    styles.liveDot,
                    { backgroundColor: totalActionsNeeded > 0 ? '#3B82F6' : '#10B981' },
                  ]}
                />
                <Text
                  style={[
                    styles.heroLiveText,
                    { color: totalActionsNeeded > 0 ? '#3B82F6' : '#10B981' },
                  ]}
                >
                  {totalActionsNeeded > 0 ? `${totalActionsNeeded} ACTIONS REQUIRED` : 'ALL CAUGHT UP'}
                </Text>
              </View>

              <Text style={[styles.heroMainTitle, { color: colors.textPrimary }]}>
                {totalActionsNeeded > 0
                  ? `${totalActionsNeeded} New Activity Alerts`
                  : 'No Pending Notifications'}
              </Text>
              <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                {totalActionsNeeded > 0
                  ? 'Review pending circle invitations and low stock alerts below.'
                  : 'You are up to date with your care circle and health schedule.'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Filter Segment Bar ── */}
        <View style={styles.filterChipsContainer}>
          {[
            { key: 'ALL', label: 'All Alerts', count: invites.length + refillAlerts.length + systemUpdates.length },
            { key: 'INVITES', label: 'Circle Invites', count: invites.length },
            { key: 'MEDS', label: 'Refills', count: refillAlerts.length },
            { key: 'SYSTEM', label: 'Health Feed', count: systemUpdates.length },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isSelected
                    ? { backgroundColor: colors.textPrimary }
                    : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? (isDark ? '#000000' : '#FFFFFF') : colors.textSecondary },
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── SECTION 1: Care Circle Invitations ── */}
        {(activeFilter === 'ALL' || activeFilter === 'INVITES') && (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <HugeiconsIcon icon={UserGroup03Icon} size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  CARE CIRCLE INVITATIONS
                </Text>
              </View>
              {invites.length > 0 && (
                <View style={[styles.badgeNew, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
                  <Text style={styles.badgeNewText}>{invites.length} PENDING</Text>
                </View>
              )}
            </View>

            {loading ? (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
                  Checking invitations...
                </Text>
              </View>
            ) : invites.length > 0 ? (
              invites.map((item, idx) => {
                const senderId = item.senderId || item._id || item.id || `inv-${idx}`;
                const isProcessing = !!actionInProgress[senderId];
                const displayName = item.name || item.username || 'Caregiver Member';
                const initial = displayName.charAt(0).toUpperCase();

                return (
                  <View
                    key={senderId}
                    style={[
                      styles.notifCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View
                        style={[
                          styles.avatarCircle,
                          { backgroundColor: isDark ? '#3B82F6' : '#2563EB' },
                        ]}
                      >
                        <Text style={styles.avatarInitial}>{initial}</Text>
                      </View>

                      <View style={styles.cardInfoCol}>
                        <View style={styles.titleRow}>
                          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                            {displayName}
                          </Text>
                          <Text style={[styles.timeText, { color: colors.textMuted }]}>Pending</Text>
                        </View>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                          wants to join your Care Circle to share health vitals and medication schedules.
                        </Text>
                      </View>
                    </View>

                    {/* Dual Action Buttons */}
                    <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
                      <TouchableOpacity
                        style={[
                          styles.acceptBtn,
                          { backgroundColor: colors.primary },
                          isProcessing && { opacity: 0.6 },
                        ]}
                        onPress={() => handleAcceptInvite(item)}
                        disabled={isProcessing}
                        activeOpacity={0.85}
                      >
                        <HugeiconsIcon icon={Tick02Icon} size={15} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.acceptBtnText}>
                          {actionInProgress[senderId] === 'accepting' ? 'Accepting...' : 'Accept Request'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.declineBtn,
                          { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                          isProcessing && { opacity: 0.6 },
                        ]}
                        onPress={() => handleDeclineInvite(item)}
                        disabled={isProcessing}
                        activeOpacity={0.7}
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={15}
                          color={colors.textSecondary}
                          strokeWidth={2}
                        />
                        <Text style={[styles.declineBtnText, { color: colors.textSecondary }]}>
                          {actionInProgress[senderId] === 'declining' ? 'Declining...' : 'Decline'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : activeFilter === 'INVITES' ? (
              <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceAlt }]}>
                  <HugeiconsIcon icon={UserGroup03Icon} size={26} color={colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Pending Circle Invites</Text>
                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                  When relatives or doctors send invitations to link circles, they will appear here.
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* ── SECTION 2: Medication Refill Alerts ── */}
        {(activeFilter === 'ALL' || activeFilter === 'MEDS') && refillAlerts.length > 0 && (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <HugeiconsIcon icon={AlertCircleIcon} size={16} color="#F59E0B" />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  PRESCRIPTION REFILL ALERTS
                </Text>
              </View>
              <View style={[styles.badgeWarning, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
                <Text style={styles.badgeWarningText}>{refillAlerts.length} LOW STOCK</Text>
              </View>
            </View>

            {refillAlerts.map((med) => (
              <TouchableOpacity
                key={med._id}
                style={[styles.notifCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('RefillAlerts')}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
                    <HugeiconsIcon icon={PillIcon} size={18} color="#F59E0B" />
                  </View>
                  <View style={styles.cardInfoCol}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {med.medicine_name}
                      </Text>
                      <Text style={[styles.timeText, { color: '#EF4444' }]}>
                        {med.daysRemaining <= 0 ? 'Out of Stock' : `~${med.daysRemaining}d left`}
                      </Text>
                    </View>
                    <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                      Stock down to {med.quantity} {med.forms || 'units'} (Threshold: {med.threshold || 5}). Refill recommended.
                    </Text>
                  </View>
                </View>

                <View style={[styles.cardFooterAction, { borderTopColor: colors.border }]}>
                  <Text style={[styles.cardFooterActionText, { color: colors.primary }]}>
                    Manage & Quick Refill
                  </Text>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── SECTION 3: System & Health Vitals Feed ── */}
        {(activeFilter === 'ALL' || activeFilter === 'SYSTEM') && (
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <HugeiconsIcon icon={SparklesIcon} size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  HEALTH & ACTIVITY FEED
                </Text>
              </View>
            </View>

            {systemUpdates.map((item) => {
              const IconCmp = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notifCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => item.route && navigation.navigate(item.route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.iconBadge, { backgroundColor: item.iconBg }]}>
                      <HugeiconsIcon icon={IconCmp} size={18} color={item.iconColor} />
                    </View>
                    <View style={styles.cardInfoCol}>
                      <View style={styles.titleRow}>
                        <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={[styles.timeText, { color: colors.textMuted }]}>{item.time}</Text>
                      </View>
                      <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                        {item.message}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.cardFooterAction, { borderTopColor: colors.border }]}>
                    <Text style={[styles.cardFooterActionText, { color: colors.textSecondary }]}>
                      {item.actionLabel}
                    </Text>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  navSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
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
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  heroLiveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroLiveText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  heroSubText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },

  // Filter Chips
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Sections
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  badgeNew: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeNewText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeWarning: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeWarningText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Loader & Empty
  loaderBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyBox: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },

  // Notification Card
  notifCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Card Footer Action
  cardFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  cardFooterActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default NotificationsScreen;
