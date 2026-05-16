import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Settings02Icon } from '@hugeicons/core-free-icons';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity style={styles.headerButton}>
          <HugeiconsIcon icon={Settings02Icon} size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: '#F8FAFC' }}
      >

        {/* New Notifications Header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>New Notifications</Text>
          <View style={styles.todayPill}>
            <Text style={styles.todayPillText}>Today</Text>
          </View>
        </View>

        {/* Medication Reminder Card */}
        <View style={styles.notifCard}>
          <View style={styles.notifTopRow}>
            <View style={styles.pillIconCircle}>
              <Icon name="medkit" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.notifTitleRow}>
                <Text style={styles.notifTitle}>Lisinopril 10mg - Due now</Text>
                <Text style={styles.notifTime}>12:00 PM</Text>
              </View>
              <Text style={styles.notifBody}>
                Time for your daily hypertension medication.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.markTakenButton}>
            <Icon name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.markTakenText}>Mark as Taken</Text>
          </TouchableOpacity>
        </View>

        {/* Care Circle Invite Card */}
        <View style={styles.notifCard}>
          <View style={styles.notifTopRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
              style={styles.avatarImage}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.notifTitleRow}>
                <Text style={styles.notifTitle}>
                  Sarah Miller invited you to her Care Circle
                </Text>
                <Text style={styles.notifTime}>10:45{'\n'}AM</Text>
              </View>
              <Text style={styles.notifBody}>
                Share health updates and medical reminders with Sarah.
              </Text>
            </View>
          </View>
          <View style={styles.inviteBottomRow}>
            <Icon name="person" size={18} color="#94A3B8" />
            <View style={styles.inviteButtonsRow}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Activity Header */}
        <View style={[styles.sectionRow, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.earlierText}>Earlier</Text>
        </View>

        {/* Low Stock Card */}
        <View style={styles.notifCard}>
          <View style={styles.notifTopRow}>
            <View style={styles.warningIconCircle}>
              <Icon name="warning" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.notifTitleRow}>
                <Text style={styles.notifTitle}>Low Stock: Vitamin D3</Text>
                <Text style={styles.notifTime}>Yesterday</Text>
              </View>
              <Text style={styles.notifBody}>
                5 capsules left. It's time to request a refill from your pharmacist.
              </Text>
              <TouchableOpacity style={{ marginTop: 6 }}>
                <Text style={styles.reorderText}>REORDER NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hydration Goal Card */}
        <View style={styles.notifCard}>
          <View style={styles.notifTopRow}>
            <View style={styles.hydrationIconCircle}>
              <Icon name="water" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.notifTitleRow}>
                <Text style={styles.notifTitle}>You hit your hydration goal!</Text>
                <Text style={styles.notifTime}>2 days ago</Text>
              </View>
              <Text style={styles.notifBody}>
                That's 3 days in a row! Keep up the great consistency.
              </Text>
            </View>
          </View>
        </View>

        {/* End of notifications */}
        <View style={styles.endSection}>
          <Icon name="notifications-off-outline" size={28} color="#CBD5E1" style={{ marginBottom: 10 }} />
          <Text style={styles.endText}>
            You've reached the end of your recent{'\n'}notifications.
          </Text>
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },

  /* Section Row */
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  todayPill: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  todayPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  earlierText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },

  /* Notification Card */
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'right',
  },
  notifBody: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  /* Icons */
  pillIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hydrationIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  /* Mark as Taken Button */
  markTakenButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  markTakenText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Invite Row */
  inviteBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  inviteButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  declineButton: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  declineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Reorder */
  reorderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    letterSpacing: 0.3,
  },

  /* End Section */
  endSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  endText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
