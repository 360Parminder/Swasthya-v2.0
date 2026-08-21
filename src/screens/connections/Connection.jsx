import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../components/ui/colors';
import { useConnection } from '../../context/ConnectionContext';

import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  MoreVerticalIcon,
  TaskDaily01Icon,
  ArrowLeft01Icon,
  UserAdd01Icon,
  PillIcon,
  FirstAidKitIcon,
  Clock01Icon,
  ArrowRight01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';

import AddConnection from '../../components/model/Connection/AddConnection';
import PendingRequests from '../../components/model/Connection/PendingRequests';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const Connection = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const { authState } = useAuth();
  const navigation = useNavigation();

  const {
    connections,
    receivedRequests,
    sentRequests,
    isLoading,
    refreshAll,
    updateConnection,
    cancelRequest,
  } = useConnection();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pendingModalVisible, setPendingModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);

  const totalPending = (receivedRequests?.length || 0) + (sentRequests?.length || 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connections</Text>
          <TouchableOpacity onPress={() => setPendingModalVisible(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {receivedRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{receivedRequests.length}</Text>
              </View>
            )}
            <HugeiconsIcon icon={MoreVerticalIcon} size={24} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {/* Main Title Area */}
          <Text style={styles.pageTitle}>Your Support Circle</Text>
          <Text style={styles.pageSubtitle}>
            Stay connected with your personal network of family, friends, and lifestyle coaches.
          </Text>

          {/* Pending Invitations Banner */}
          {totalPending > 0 && (
            <TouchableOpacity
              style={styles.invitationBanner}
              onPress={() => setPendingModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.invitationBannerLeft}>
                <View style={styles.invitationIconBox}>
                  <HugeiconsIcon icon={Mail01Icon} size={20} color={COLORS.primary} variant="solid" />
                </View>
                <View style={styles.invitationTextCol}>
                  <Text style={styles.invitationTitle}>Pending Invitations</Text>
                  <Text style={styles.invitationSubtitle}>
                    {receivedRequests.length > 0 ? `${receivedRequests.length} received` : ''}
                    {receivedRequests.length > 0 && sentRequests.length > 0 ? ' • ' : ''}
                    {sentRequests.length > 0 ? `${sentRequests.length} sent` : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.invitationActionRow}>
                <Text style={styles.invitationActionText}>View</Text>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={COLORS.primary} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          )}

          {/* Section Heading */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Members ({connections.length})</Text>
          </View>

          {/* Render Active Connections */}
          {connections.length > 0 ? (
            connections.map((conn) => {
              const displayName = conn.name || conn.username || 'Connection Member';
              const displaySub = conn.email || `@${conn.username}` || 'Active Circle Member';
              return (
                <View key={conn._id || conn.id} style={styles.connectionCard}>
                  <View style={styles.connectionCardTop}>
                    <Image source={{ uri: conn.avatar || DEFAULT_AVATAR }} style={styles.connectionAvatar} />
                    <View style={styles.activeConnectionBadge}>
                      <Text style={styles.activeConnectionText}>ACTIVE MEMBER</Text>
                    </View>
                  </View>
                  <Text style={styles.connectionName} numberOfLines={1}>{displayName}</Text>
                  <Text style={styles.connectionRole} numberOfLines={1}>{displaySub}</Text>

                  <View style={styles.connectionFooterRow}>
                    <HugeiconsIcon icon={Clock01Icon} size={14} color={COLORS.textSecondary} />
                    <Text style={styles.connectionFooterText}>Circle Member</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No connections yet</Text>
              <Text style={styles.emptyText}>Tap the + button to search and invite family members or caregivers</Text>
            </View>
          )}

          {/* Professional Care Circle Card */}
          <View style={styles.professionalCareCard}>
            <View style={styles.careHeaderRow}>
               <View style={styles.careIconBox}>
                 <HugeiconsIcon icon={FirstAidKitIcon} size={20} color={COLORS.primary} variant="solid" />
               </View>
               <Text style={styles.careTitle}>Professional Care Circle</Text>
            </View>
            <Text style={styles.careDescription}>
              Access your official medical records, consult with your verified physicians, or manage current prescriptions provided by your healthcare team.
            </Text>
            <View style={styles.careButtonsRow}>
              <TouchableOpacity
                style={styles.careButton}
                onPress={() => navigation.navigate('MedicationHistory')}
                activeOpacity={0.7}
              >
                <HugeiconsIcon icon={TaskDaily01Icon} size={16} color={COLORS.primary} />
                <Text style={styles.careButtonText}>Medical Logs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.careButton, styles.careButtonOutlined]}
                onPress={() => navigation.navigate('Medication')}
                activeOpacity={0.7}
              >
                <HugeiconsIcon icon={PillIcon} size={16} color={COLORS.buttonText} />
                <Text style={[styles.careButtonText, { color: COLORS.buttonText }]}>Medications</Text>
              </TouchableOpacity>
            </View>
            <HugeiconsIcon icon={FirstAidKitIcon} size={120} color="rgba(255,255,255,0.06)" style={styles.careBgIcon} />
          </View>

          {/* Need more support? */}
          <View style={styles.supportCard}>
             <View style={{ flex: 1 }}>
               <Text style={styles.supportTitle}>Need more support?</Text>
               <Text style={styles.supportSubtitle}>
                 Find lifestyle mentors or specialty coaches for your goals.
               </Text>
             </View>
             <TouchableOpacity
               style={styles.findCoachesBtn}
               onPress={() => navigation.navigate('HelpSupport')}
               activeOpacity={0.7}
             >
               <Text style={styles.findCoachesText}>Help &{"\n"}Support</Text>
             </TouchableOpacity>
          </View>
          
          {/* Spacer for bottom tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddModalVisible(true)}
          activeOpacity={0.8}
        >
          <HugeiconsIcon icon={UserAdd01Icon} size={26} color={COLORS.buttonText} />
        </TouchableOpacity>

        {/* Dynamic Pending & Sent Invitations Modal */}
        <PendingRequests
          isVisible={pendingModalVisible}
          onClose={() => setPendingModalVisible(false)}
          receivedRequests={receivedRequests}
          sentRequests={sentRequests}
          onAccept={(id) => updateConnection(id, 'accepted')}
          onDecline={(id) => updateConnection(id, 'rejected')}
          onCancel={(id) => cancelRequest(id)}
        />

        {/* Add Connection Modal */}
        <AddConnection 
          isVisible={addModalVisible} 
          onClose={() => setAddModalVisible(false)}
          onSuccess={refreshAll}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  invitationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '33',
  },
  invitationBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invitationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  invitationTextCol: {
    flex: 1,
  },
  invitationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  invitationSubtitle: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  invitationActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  invitationActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 4,
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  connectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  connectionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  connectionAvatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: COLORS.inputBackground,
  },
  activeConnectionBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeConnectionText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  connectionName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  connectionRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  connectionFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionFooterText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  viewScheduleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  emptyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  professionalCareCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  careHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  careIconBox: {
    backgroundColor: COLORS.buttonText,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  careTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.buttonText,
  },
  careDescription: {
    fontSize: 14,
    color: COLORS.buttonText,
    lineHeight: 22,
    marginBottom: 20,
    zIndex: 2,
  },
  careButtonsRow: {
    flexDirection: 'row',
    zIndex: 2,
  },
  careButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonText,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  careButtonOutlined: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  careButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  careBgIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
    transform: [{ rotate: '-15deg' }],
  },
  supportCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    paddingRight: 10,
  },
  findCoachesBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findCoachesText: {
    color: COLORS.buttonText,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginVertical: 12,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.inputBackground,
  },
  requestUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  requestEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 1,
  },
  requestBtns: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptText: {
    color: COLORS.buttonText,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default Connection;