import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, SafeAreaView } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication';
import { useThemeColors } from '../../components/ui/colors';
import GeneralModal from '../../components/common/GeneralModal';
import ViewMedications from '../../components/model/Medication/ViewMedications';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Medication = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const [modalType, setModalType] = useState(null);
  const navigation = useNavigation();

  const closeModal = () => setModalType(null);

  // Adaptive teal color for the design
  const TEAL = COLORS.background === '#121212' ? '#4DB6AC' : '#00897B';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={TEAL} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: TEAL }]}>Medications</Text>
          <View style={{ width: 24 }} />
        </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page Header ── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Medication</Text>
          <Text style={styles.pageSubtitle}>
            Manage your daily intake and oversee your circle's wellness.
          </Text>
        </View>

        {/* ── Personal Medications Section ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: TEAL }]}>Personal Medications</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: TEAL }]}
            onPress={() => setModalType('add')}
            activeOpacity={0.7}
          >
            <Icon name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsList}>
          {/* Card 1: Lisinopril */}
          <View style={styles.medCard}>
            <View style={[styles.medIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Icon name="medkit" size={24} color={COLORS.success} />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medTitle}>Lisinopril</Text>
              <Text style={styles.medSubtitle}>10MG  •  TABLET</Text>
            </View>
            <View style={styles.medRight}>
              <Text style={styles.medTime}>08:00 AM</Text>
              <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: COLORS.success }]}>ACTIVE</Text>
              </View>
            </View>
          </View>

          {/* Card 2: Vitamin D3 */}
          <View style={styles.medCard}>
            <View style={[styles.medIconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Icon name="bandage" size={24} color={COLORS.info} />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medTitle}>Vitamin D3</Text>
              <Text style={styles.medSubtitle}>2000 IU  •  CAPSULE</Text>
            </View>
            <View style={styles.medRight}>
              <Text style={styles.medTime}>12:30 PM</Text>
              <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: COLORS.info }]}>UPCOMING</Text>
              </View>
            </View>
          </View>

          {/* Card 3: Metformin */}
          <View style={styles.medCard}>
            <View style={[styles.medIconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Icon name="medical" size={24} color={COLORS.danger} />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medTitle}>Metformin</Text>
              <Text style={styles.medSubtitle}>500MG  •  DELAYED-RELEASE</Text>
            </View>
            <View style={styles.medRight}>
              <Text style={styles.medTime}>07:00 PM</Text>
              <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={[styles.badgeText, { color: COLORS.danger }]}>MISSED</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Connections Section ── */}
        <View style={styles.connectionsContainer}>
          <View style={styles.connectionsHeaderRow}>
            <View>
              <Text style={styles.connectionsTitle}>Connections</Text>
              <Text style={styles.connectionsSubtitle}>Overseeing Sarah's Plan</Text>
            </View>
            <View style={styles.connectionsIconWrapper}>
              <Icon name="person-add" size={20} color={TEAL} />
            </View>
          </View>

          <View style={styles.connectionsList}>
            {/* Connection Card 1: Atorvastatin */}
            <View style={styles.connCard}>
              <View style={styles.connTopRow}>
                <Text style={[styles.connName, { color: TEAL }]}>SARAH M.</Text>
                <Text style={styles.connTime}>09:00 PM</Text>
              </View>
              <View style={styles.connBottomRow}>
                <View style={styles.connInfo}>
                  <Text style={styles.connMedTitle}>Atorvastatin</Text>
                  <Text style={styles.connMedSubtitle}>20mg Oral</Text>
                </View>
                <View style={[styles.badge, styles.connBadge, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                  <Text style={[styles.badgeText, { color: COLORS.info }]}>UPCOMING</Text>
                </View>
              </View>
            </View>

            {/* Connection Card 2: Amoxicillin */}
            <View style={styles.connCard}>
              <View style={styles.connTopRow}>
                <Text style={[styles.connName, { color: TEAL }]}>SARAH M.</Text>
                <Text style={styles.connTime}>02:00 PM</Text>
              </View>
              <View style={styles.connBottomRow}>
                <View style={styles.connInfo}>
                  <Text style={styles.connMedTitle}>Amoxicillin</Text>
                  <Text style={styles.connMedSubtitle}>500mg Liquid</Text>
                </View>
                <View style={[styles.badge, styles.connBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Text style={[styles.badgeText, { color: COLORS.success }]}>ACTIVE</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.adherenceContainer}>
            <View style={styles.adherenceRow}>
              <Text style={styles.adherenceLabel}>ADHERENCE</Text>
              <Text style={[styles.adherenceValue, { color: TEAL }]}>85%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '85%', backgroundColor: TEAL }]} />
            </View>
          </View>
        </View>

        <View style={styles.actionCardsContainer}>
          {/* History Card */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => navigation.navigate('MedicationHistory')}>
            <View style={[styles.actionIconBox, { backgroundColor: '#E0F2F1' }]}>
              <MaterialIcon name="history" size={26} color={TEAL} />
            </View>
            <Text style={styles.actionTitle}>Medication History</Text>
            <Text style={styles.actionSubtitle}>View your past adherence</Text>
            <View style={styles.actionLinkRow}>
              <Text style={[styles.actionLinkText, { color: TEAL }]}>VIEW HISTORY</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={TEAL} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>

          {/* Refill Card */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
              <MaterialIcon name="bell-alert" size={24} color="#DC2626" />
            </View>
            <Text style={styles.actionTitle}>Refill Status</Text>
            <Text style={styles.actionSubtitle}>Check low stock alerts</Text>
            <View style={styles.actionLinkRow}>
              <Text style={[styles.actionLinkText, { color: '#DC2626' }]}>CHECK STOCK</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#DC2626" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modals */}
      <GeneralModal
        visible={modalType === 'view'}
        onClose={closeModal}
        title="Medications"
      >
        <ViewMedications medications={[]} />
      </GeneralModal>
      <AddMedication isVisible={modalType === 'add'} onClose={closeModal} />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  safeArea: {
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
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    // paddingTop: 16,
    paddingBottom: 65,
  },
  pageHeader: {
    marginBottom: 10,
    // marginTop: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.healthCardText,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: COLORS.healthCardSubtext,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cardsList: {
    gap: 12,
    marginBottom: 32,
  },
  medCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  medTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginBottom: 4,
  },
  medSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.healthCardSubtext,
    letterSpacing: 0.5,
  },
  medRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  medTime: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  connectionsContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  connectionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  connectionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginBottom: 4,
  },
  connectionsSubtitle: {
    fontSize: 13,
    color: COLORS.healthCardSubtext,
    fontWeight: '500',
  },
  connectionsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionsList: {
    gap: 12,
    marginBottom: 24,
  },
  connCard: {
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  connTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  connTime: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.healthCardText,
  },
  connBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  connInfo: {
    flex: 1,
  },
  connMedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginBottom: 4,
  },
  connMedSubtitle: {
    fontSize: 12,
    color: COLORS.healthCardSubtext,
    fontStyle: 'italic',
  },
  connBadge: {
    minWidth: 70,
    alignItems: 'center',
  },
  adherenceContainer: {
    marginTop: 4,
  },
  adherenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adherenceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.healthCardSubtext,
    letterSpacing: 1,
  },
  adherenceValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.iconBackground,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionCardsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.healthCardText,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.healthCardSubtext,
    marginBottom: 20,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 6,
  },
});

export default Medication;


