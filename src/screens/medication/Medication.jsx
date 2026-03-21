import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication';
import { useThemeColors } from '../../components/ui/colors';
import { medicationApi } from '../../api/medicationApi';
import GeneralModal from '../../components/common/GeneralModal';
import ViewMedications from '../../components/model/Medication/ViewMedications';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import MedicationScheduleCard from '../../components/home/MedicationScheduleCard';

// ─── Mini Chart Components (same as HomeScreen) ─────────────────────

const WeekDays = ({ color }) => (
  <View style={miniStyles.weekRow}>
    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
      <Text key={i} style={[miniStyles.weekLabel, { color }]}>
        {d}
      </Text>
    ))}
  </View>
);

const DotGrid = ({ dotColor, filled, subTextColor, doses = 4 }) => (
  <View>
    <View style={miniStyles.dotGrid}>
      {filled.map((dayDoses, dayIdx) => (
        <View key={dayIdx} style={miniStyles.dayColumn}>
          {Array.from({ length: doses }, (_, doseIdx) => (
            <View
              key={doseIdx}
              style={[
                miniStyles.dot,
                {
                  backgroundColor: dayDoses[doseIdx] ? dotColor : '#D1D5DB',
                  opacity: dayDoses[doseIdx] ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
    <WeekDays color={subTextColor} />
  </View>
);

// ─── Helpers ─────────────────────────────────────────────────────────

const getNextMedicationTime = (medications) => {
  const now = new Date();
  let nextTime = null;

  medications.forEach((med) => {
    med.record?.forEach((rec) => {
      rec.times?.forEach((t) => {
        const recTime = new Date(t.reception_time);
        // Compare hours and minutes only (same day)
        const todayTime = new Date(now);
        todayTime.setHours(recTime.getUTCHours(), recTime.getUTCMinutes(), 0, 0);
        if (todayTime > now && (!nextTime || todayTime < nextTime)) {
          nextTime = todayTime;
        }
      });
    });
  });

  if (!nextTime) return 'All done';
  return nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getTotalTimesPerDay = (medications) => {
  let total = 0;
  medications.forEach((med) => {
    med.record?.forEach((rec) => {
      total += rec.times?.length || 0;
    });
  });
  return total || 4; // Default 4 if no data
};

const getWeeklyAdherence = () => {
  // JS getDay(): 0=Sun, we need Mon-first → shift
  const dayIndex = (new Date().getDay() + 6) % 7; // 0=Mon … 6=Sun
  // Each day has 4 dose slots: past days all true, future all false
  return Array.from({ length: 7 }, (_, i) =>
    Array.from({ length: 4 }, () => i < dayIndex)
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const Medication = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const [modalType, setModalType] = useState(null);
  const [medications, setMedications] = useState([]);

  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 10,
    });
  };

  const fetchMedications = async () => {
    try {
      const response = await medicationApi.getAllMedications();
      setMedications(response?.data?.medications ?? []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [modalType]);

  const closeModal = () => setModalType(null);

  const nextTime = useMemo(() => getNextMedicationTime(medications), [medications]);
  const timesPerDay = useMemo(() => getTotalTimesPerDay(medications), [medications]);
  const weekDots = useMemo(() => getWeeklyAdherence(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Medication Schedule Card ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <MedicationScheduleCard medications={medications} />
        </View>

        {/* ── Quick Link Cards ── */}
        <View style={styles.quickLinksContainer}>
          {/* My Medications */}
          <TouchableOpacity
            onPress={() => setModalType('view')}
            style={styles.quickLinkCard}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinkLeft}>
              <View style={[styles.quickLinkIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="medkit" size={22} color="#2E7D32" />
              </View>
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkTitle}>My Medications</Text>
                <Text style={styles.quickLinkSubtitle}>Manage your personal medications</Text>
              </View>
            </View>
            <View style={styles.quickLinkRight}>
              <Text style={styles.quickLinkChevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Connections Medications */}
          <TouchableOpacity
            onPress={() => showToast('info', 'Coming soon', 'Feature under progress')}
            style={styles.quickLinkCard}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinkLeft}>
              <View style={[styles.quickLinkIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="people" size={22} color="#E65100" />
              </View>
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkTitle}>Connections</Text>
                <Text style={styles.quickLinkSubtitle}>Manage medications for your connections</Text>
              </View>
            </View>
            <View style={styles.quickLinkRight}>
              <Text style={styles.quickLinkChevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Add Medication Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalType('add')}
          activeOpacity={0.7}
        >
          <Icon name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* View Medications Modal */}
      <GeneralModal
        visible={modalType === 'view'}
        onClose={closeModal}
        title="Medications"
      >
        <ViewMedications medications={medications} />
      </GeneralModal>
      <AddMedication isVisible={modalType === 'add'} onClose={closeModal} />
    </View>
  );
};

// ─── Mini Chart Styles ───────────────────────────────────────────────

const miniStyles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  weekLabel: {
    fontSize: 9,
    fontWeight: '500',
    width: 14,
    textAlign: 'center',
  },
  dotGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

// ─── Main Styles ─────────────────────────────────────────────────────

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // ── Status card (Nutrition-style) ──
  statusCardWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  healthCard: {
    width: '100%',
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthCardIcon: {
    fontSize: 14,
  },
  healthCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.healthCardText,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 12,
    color: COLORS.healthCardSubtext,
    fontWeight: '500',
  },
  todayChevron: {
    fontSize: 14,
    color: COLORS.healthCardSubtext,
    fontWeight: '600',
  },
  healthCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  healthCardValueSection: {
    flex: 1,
  },
  healthCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  healthCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.healthCardText,
  },
  healthCardSubtitle: {
    fontSize: 12,
    color: COLORS.healthCardSubtext,
    marginTop: 2,
    fontWeight: '400',
  },
  healthCardChartSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  // ── Quick link cards ──
  quickLinksContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  quickLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  quickLinkIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  quickLinkTextContainer: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.healthCardText,
  },
  quickLinkSubtitle: {
    fontSize: 13,
    color: COLORS.healthCardSubtext,
    marginTop: 2,
    fontWeight: '400',
  },
  quickLinkRight: {
    paddingLeft: 8,
  },
  quickLinkChevron: {
    fontSize: 22,
    color: COLORS.healthCardSubtext,
    fontWeight: '600',
  },
  // ── Add button ──
  addButton: {
    marginHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Medication;


