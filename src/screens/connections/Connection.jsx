import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import GeneralModal from '../../components/common/GeneralModal';
import Toast from 'react-native-toast-message';
import { connectionApi } from '../../api/connectionApi';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  MoreVerticalIcon,
  TaskDaily01Icon,
  ArrowLeft01Icon,
  UserAdd01Icon,
  PillIcon,
  FirstAidKitIcon,
} from '@hugeicons/core-free-icons';

import AddConnection from '../../components/model/Connection/AddConnection';
import PendingRequests from '../../components/model/Connection/PendingRequests';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const Connection = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const { authState } = useAuth();
  const navigation = useNavigation();

  // Main UI state
  const [activeModal, setActiveModal] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pendingModalVisible, setPendingModalVisible] = useState(false);
  
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Toast helper
  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3200,
      autoHide: true,
      topOffset: 55,
    });
  };

  const fetchRequests = async () => {
    try {
      const response = await connectionApi.viewPending();
      setRequests((response.data.connections || []).filter(Boolean));
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to fetch requests');
    }
  };

  const updateConnection = async (senderId, status) => {
    try {
      await connectionApi.updateRequest(senderId, status);
      await fetchRequests();
      await fetchConnections();
      showToast('success', 'Connection Updated');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred');
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await connectionApi.viewAll();
      setConnections(response?.data?.connections || []);
    } catch (error) {
      // ignore silently if 404 or empty
    }
  };

  // On mount
  useEffect(() => {
    fetchConnections();
    fetchRequests();
  }, [addModalVisible]); // Re-fetch when add modal might have closed

  // Modal logic
  const openModal = (modalName) => {
    if (!activeModal) setActiveModal(modalName);
  };
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (activeModal === 'request') fetchRequests();
    else if (activeModal === 'view') fetchConnections();
  }, [activeModal]);


  const ViewRequestModalContent = () => {
    const filteredRequests = requests.filter(req => req._id !== authState?.user?.id);
    return (
      <View>
        {filteredRequests.length === 0 ? (
          <Text style={styles.noDataText}>No connection requests found.</Text>
        ) : (
          filteredRequests.map(req => (
            <View key={req._id} style={styles.requestItem}>
              <Image source={{ uri: req.avatar || DEFAULT_AVATAR }} style={styles.requestAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.requestUsername}>{req.username}</Text>
                <Text style={styles.requestEmail}>{req.email}</Text>
              </View>
              <View style={styles.requestBtns}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => updateConnection(req._id, 'accepted')}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateConnection(req._id, 'rejected')}
                >
                  <Text style={styles.acceptText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

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
            {requests.length > 0 && <View style={styles.badge} />}
            <HugeiconsIcon icon={MoreVerticalIcon} size={24} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Main Title Area */}
          <Text style={styles.pageTitle}>Your Support Circle</Text>
          <Text style={styles.pageSubtitle}>
            Stay connected with your personal network of family, friends, and lifestyle coaches.
          </Text>

          {/* Render Connections */}
          {connections.length > 0 ? (
            connections.map((conn, index) => (
              <View key={conn._id} style={styles.connectionCard}>
                <View style={styles.connectionCardTop}>
                  <Image source={{ uri: conn.avatar || DEFAULT_AVATAR }} style={styles.connectionAvatar} />
                  <View style={styles.activeConnectionBadge}>
                    <Text style={styles.activeConnectionText}>ACTIVE CONNECTION</Text>
                  </View>
                </View>
                <Text style={styles.connectionName}>{conn.username}</Text>
                <Text style={styles.connectionRole}>{conn.email || 'Connection'}</Text>

                {index % 2 === 0 ? (
                  <View style={styles.connectionFooterRow}>
                    <Icon name="time-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.connectionFooterText}>Last active 2h ago</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.connectionFooterRow}>
                    <Text style={styles.viewScheduleText}>View Profile</Text>
                    <Icon name="chevron-forward" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No connections yet</Text>
              <Text style={styles.emptyText}>Tap the + button to add a friend or family member</Text>
            </View>
          )}

          {/* Professional Care Circle Card */}
          <View style={styles.professionalCareCard}>
            <View style={styles.careHeaderRow}>
               <View style={styles.careIconBox}>
                 <HugeiconsIcon icon={FirstAidKitIcon} size={20} color="#004D40" variant="solid" />
               </View>
               <Text style={styles.careTitle}>Professional Care Circle</Text>
            </View>
            <Text style={styles.careDescription}>
              Access your official medical records, consult with your verified physicians, or manage current prescriptions provided by your healthcare team.
            </Text>
            <View style={styles.careButtonsRow}>
              <TouchableOpacity style={styles.careButton}>
                <HugeiconsIcon icon={TaskDaily01Icon} size={16} color="#004D40" />
                <Text style={styles.careButtonText}>Medical Records</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.careButton, styles.careButtonOutlined]}>
                <HugeiconsIcon icon={PillIcon} size={16} color="#FFFFFF" />
                <Text style={[styles.careButtonText, { color: '#FFFFFF' }]}>Prescriptions</Text>
              </TouchableOpacity>
            </View>
            <Icon name="medical" size={120} color="rgba(255,255,255,0.06)" style={styles.careBgIcon} />
          </View>

          {/* Need more support? */}
          <View style={styles.supportCard}>
             <View style={{ flex: 1 }}>
               <Text style={styles.supportTitle}>Need more support?</Text>
               <Text style={styles.supportSubtitle}>
                 Find lifestyle mentors or specialty coaches for your goals.
               </Text>
             </View>
             <TouchableOpacity style={styles.findCoachesBtn}>
               <Text style={styles.findCoachesText}>Find{"\n"}Coaches</Text>
             </TouchableOpacity>
          </View>
          
          {/* Spacer for bottom tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)} activeOpacity={0.8}>
          <HugeiconsIcon icon={UserAdd01Icon} size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <PendingRequests
          isVisible={pendingModalVisible}
          onClose={() => setPendingModalVisible(false)}
          requests={requests}
        />

        {/* The new "Grow your Care Circle" Modal */}
        <AddConnection 
          isVisible={addModalVisible} 
          onClose={() => setAddModalVisible(false)} 
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
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    zIndex: 10,
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
    backgroundColor: '#D1E8E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeConnectionText: {
    color: '#004D40',
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
    backgroundColor: '#004D40',
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
    backgroundColor: '#A7F3D0',
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
    color: '#FFFFFF',
  },
  careDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  careButtonOutlined: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  careButtonText: {
    color: '#004D40',
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
    backgroundColor: '#006A6A',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findCoachesText: {
    color: '#FFFFFF',
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
    backgroundColor: '#006A6A',
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
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default Connection;