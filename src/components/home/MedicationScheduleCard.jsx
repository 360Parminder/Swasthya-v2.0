import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { PillIcon, MedicineBottle01Icon, InjectionIcon } from '@hugeicons/core-free-icons';

// ─── Medication Type Icons & Map ────────────────────────────────────
const getIconForForm = (form) => {
  switch (form) {
    case 'tablet':
    case 'capsule':
      return PillIcon;
    case 'liquid':
    case 'drops':
      return MedicineBottle01Icon;
    case 'injection':
      return InjectionIcon;
    default:
      return PillIcon;
  }
};

const MedicationScheduleCard = ({ medications }) => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const activeCount = medications?.length || 0;

  // Flatten medications into individual doses
  const scheduledDoses = useMemo(() => {
    if (!medications || medications.length === 0) return [];

    let flatList = [];
    medications.forEach((med, originalIndex) => {
      if (med.times && med.times.length > 0) {
        med.times.forEach((t) => {
          flatList.push({ ...med, doseInstance: t, originalIndex });
        });
      } else {
        flatList.push({ ...med, doseInstance: null, originalIndex });
      }
    });

    // Sort by time chronologically
    flatList.sort((a, b) => {
      if (!a.doseInstance?.reception_time || !b.doseInstance?.reception_time) return 0;
      return new Date(a.doseInstance.reception_time) - new Date(b.doseInstance.reception_time);
    });

    return flatList;
  }, [medications]);

  return (
    <TouchableOpacity
      style={[
        styles.outerContainer,
        {
          backgroundColor: isDarkMode ? '#121217' : '#FFFFFF',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
        }
      ]}
      onPress={() => navigation.navigate('Medication')}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#93C5FD' : '#2563EB' }]}>
          MEDICATION SCHEDULE
        </Text>
        <View style={[styles.badgeContainer, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
          <Text style={[styles.badgeText, { color: isDarkMode ? '#93C5FD' : '#2563EB' }]}>
            {activeCount} ACTIVE
          </Text>
        </View>
      </View>

      <Text style={[styles.mainTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
        {activeCount > 0 ? `${activeCount} Prescriptions Today` : 'No Scheduled Meds'}
      </Text>

      <View style={styles.listContainer}>
        {scheduledDoses.length > 0 ? scheduledDoses.slice(0, 3).map((med, index) => {
          const iconShape = getIconForForm(med?.forms?.toLowerCase() || '');
          const cardBg = isDarkMode ? '#1A1A22' : '#F3F4F6';

          let timeDisplay = index === 0 ? '08:00 AM' : '10:00 PM';
          let doseStr = null;

          if (med.doseInstance && med.doseInstance.reception_time) {
            const d = new Date(med.doseInstance.reception_time);
            timeDisplay = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const doseValue = med.doseInstance.dose || '1';
            const formStr = med?.forms ? med.forms.toLowerCase() : 'unit';
            const pluralForm = parseInt(doseValue, 10) > 1 && !formStr.endsWith('s') ? `${formStr}s` : formStr;
            doseStr = `${doseValue} ${pluralForm}`;
          }

          return (
            <View 
              key={med._id ? `${med._id}-${index}` : index} 
              style={[
                styles.medCard, 
                { 
                  backgroundColor: cardBg,
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#E5E7EB'
                }
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#22222D' : '#E5E7EB' }]}>
                <HugeiconsIcon icon={iconShape} size={20} color={isDarkMode ? '#93C5FD' : '#2563EB'} />
              </View>

              <View style={styles.medInfo}>
                <Text style={[styles.medName, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                  {med?.medicine_name || (index === 0 ? 'Lisinopril' : 'Atorvastatin')}
                </Text>
                <Text style={[styles.medInstruction, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
                  {(med?.strength && med?.unit) 
                    ? `${med.strength} ${med.unit} • ${doseStr || med.description || 'Daily'}` 
                    : (index === 0 ? '10mg • Daily with breakfast' : '20mg • Before sleep')}
                </Text>
              </View>

              <View style={styles.timeBox}>
                <Text style={[styles.timeText, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                  {timeDisplay}
                </Text>
              </View>
            </View>
          );
        }) : (
          <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? '#1A1A22' : '#F3F4F6' }]}>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#A1A1AA' : '#6B7280' }]}>
              All medications are up to date.
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  listContainer: {
    gap: 10,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  medInstruction: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeBox: {
    marginLeft: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MedicationScheduleCard;
