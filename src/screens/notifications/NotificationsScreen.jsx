import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft01Icon,
  Tick02Icon,
  Cancel01Icon,
  UserGroupIcon,
  UserIcon,
  Medicine01Icon,
  AlertCircleIcon,
  DropletIcon,
  Notification01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { connectionApi } from '../../api/connectionApi';
import { showToast } from '../../config/toastConfig';
import { playTickSound } from '../../services/soundService';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Caregiver&background=random';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState({});

  const fetchInvites = useCallback(async () => {
    try {
      const response = await connectionApi.viewPending();
      const rawConnections =
        response?.data?.connections ||
        response?.data?.requests ||
        response?.data?.data ||
        [];

      // Filter to only pending received invitations
      const pendingList = Array.isArray(rawConnections)
        ? rawConnections.filter((item) => item && (item.status === 'pending' || !item.status))
        : [];

      setInvites(pendingList);
    } catch (error) {
      console.log('Error fetching notification invites:', error?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInvites();
  }, [fetchInvites]);

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

  const theme = isDark ? darkStyles : lightStyles;

  return (
    <SafeAreaView style={[styles.safeArea, theme.safeArea]} edges={['bottom', 'left', 'right']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0B0F19' : '#F8FAFC'}
        translucent={Platform.OS === 'android'}
      />

      {/* ── Top Header ── */}
      <View
        style={[
          styles.header,
          theme.header,
          {
            paddingTop: Math.max(
              insets.top,
              Platform.OS === 'android' ? (StatusBar.currentHeight || 16) + 6 : 14
            ),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, theme.iconBtn]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={20}
            color={isDark ? '#F8FAFC' : '#0F172A'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, theme.headerTitle]}>Notifications</Text>

        <TouchableOpacity
          onPress={onRefresh}
          style={[styles.iconBtn, theme.iconBtn]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={RefreshIcon} size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
      >
        {/* ── SECTION: Care Circle Invites ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <HugeiconsIcon icon={UserGroupIcon} size={16} color="#3B82F6" />
            <Text style={[styles.sectionTitle, theme.sectionTitle]}>CARE CIRCLE INVITATIONS</Text>
          </View>
          {invites.length > 0 && (
            <View style={styles.badgeNew}>
              <Text style={styles.badgeNewText}>{invites.length} NEW</Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={[styles.loaderText, theme.loaderText]}>Checking for invites...</Text>
          </View>
        ) : invites.length > 0 ? (
          invites.map((item, idx) => {
            const senderId = item.senderId || item._id || item.id || `inv-${idx}`;
            const isProcessing = !!actionInProgress[senderId];

            return (
              <View key={senderId} style={[styles.notifCard, theme.notifCard]}>
                <View style={styles.cardHeaderRow}>
                  <Image
                    source={{ uri: item.avatar || DEFAULT_AVATAR }}
                    style={styles.avatarImage}
                  />
                  <View style={styles.cardInfoCol}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.cardTitle, theme.cardTitle]} numberOfLines={1}>
                        {item.name || item.username || 'Caregiver'}
                      </Text>
                      <Text style={styles.timeText}>Just now</Text>
                    </View>
                    <Text style={[styles.cardSubtitle, theme.cardSubtitle]}>
                      wants to link and share health vitals & medication schedules with you.
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.acceptBtn,
                      isProcessing && { opacity: 0.6 },
                    ]}
                    onPress={() => handleAcceptInvite(item)}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                  >
                    <HugeiconsIcon icon={Tick02Icon} size={16} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.acceptBtnText}>
                      {actionInProgress[senderId] === 'accepting' ? 'Accepting...' : 'Accept'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.declineBtn,
                      theme.declineBtn,
                      isProcessing && { opacity: 0.6 },
                    ]}
                    onPress={() => handleDeclineInvite(item)}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={16}
                      color={isDark ? '#94A3B8' : '#64748B'}
                      strokeWidth={2}
                    />
                    <Text style={[styles.declineBtnText, theme.declineBtnText]}>
                      {actionInProgress[senderId] === 'declining' ? 'Declining...' : 'Decline'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={[styles.emptyBox, theme.emptyBox]}>
            <View style={[styles.emptyIconCircle, theme.emptyIconCircle]}>
              <HugeiconsIcon icon={Notification01Icon} size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.emptyTitle, theme.emptyTitle]}>No Pending Invites</Text>
            <Text style={[styles.emptyDesc, theme.emptyDesc]}>
              When relatives or caregivers send you an invite to connect, it will appear here.
            </Text>
          </View>
        )}

        {/* ── SECTION: System & Health Updates ── */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>RECENT UPDATES</Text>
        </View>

        {/* Hydration Milestone Card */}
        <View style={[styles.notifCard, theme.notifCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
              <HugeiconsIcon icon={DropletIcon} size={18} color="#3B82F6" />
            </View>
            <View style={styles.cardInfoCol}>
              <View style={styles.titleRow}>
                <Text style={[styles.cardTitle, theme.cardTitle]}>Hydration Goal Achieved</Text>
                <Text style={styles.timeText}>Today</Text>
              </View>
              <Text style={[styles.cardSubtitle, theme.cardSubtitle]}>
                Great job! You reached your daily hydration target. Keep up the healthy habits!
              </Text>
            </View>
          </View>
        </View>

        {/* Medication Schedule Active Card */}
        <View style={[styles.notifCard, theme.notifCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
              <HugeiconsIcon icon={Medicine01Icon} size={18} color="#10B981" />
            </View>
            <View style={styles.cardInfoCol}>
              <View style={styles.titleRow}>
                <Text style={[styles.cardTitle, theme.cardTitle]}>Medication Reminders Active</Text>
                <Text style={styles.timeText}>System</Text>
              </View>
              <Text style={[styles.cardSubtitle, theme.cardSubtitle]}>
                Exact dose alarm reminders are synchronized with your device schedule.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Base Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  badgeNew: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeNewText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  loaderBox: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Notification Cards
  notifCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfoCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 12,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty State
  emptyBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
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
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});

// ─── Dark Theme Styles ─────────────────────────────────────────────
const darkStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B0F19',
  },
  header: {
    backgroundColor: '#0B0F19',
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    color: '#F8FAFC',
  },
  iconBtn: {
    backgroundColor: '#161E2E',
    borderColor: '#26334D',
  },
  sectionTitle: {
    color: '#64748B',
  },
  loaderText: {
    color: '#94A3B8',
  },
  notifCard: {
    backgroundColor: '#131B2A',
    borderColor: '#1E293B',
  },
  cardTitle: {
    color: '#F8FAFC',
  },
  cardSubtitle: {
    color: '#94A3B8',
  },
  declineBtn: {
    backgroundColor: '#161E2E',
    borderColor: '#26334D',
  },
  declineBtnText: {
    color: '#94A3B8',
  },
  emptyBox: {
    backgroundColor: '#131B2A',
    borderColor: '#1E293B',
  },
  emptyIconCircle: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  emptyTitle: {
    color: '#F8FAFC',
  },
  emptyDesc: {
    color: '#64748B',
  },
});

// ─── Light Theme Styles ────────────────────────────────────────────
const lightStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    color: '#0F172A',
  },
  iconBtn: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    color: '#64748B',
  },
  loaderText: {
    color: '#64748B',
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    color: '#0F172A',
  },
  cardSubtitle: {
    color: '#64748B',
  },
  declineBtn: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  declineBtnText: {
    color: '#64748B',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    backgroundColor: '#EFF6FF',
  },
  emptyTitle: {
    color: '#0F172A',
  },
  emptyDesc: {
    color: '#94A3B8',
  },
});

export default NotificationsScreen;
