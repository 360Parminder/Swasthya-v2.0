import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../ui/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ─── Medication Type Icons & Map ────────────────────────────────────
const getIconForForm = (form) => {
  switch (form) {
    case 'tablet':
    case 'capsule':
      return { name: 'set-all', color: '#047857' }; // We can use 'pill'
    case 'liquid':
    case 'drops':
      return { name: 'bottle-tonic-plus', color: '#1D4ED8' };
    case 'injection':
      return { name: 'needle', color: '#D97706' };
    default:
      return { name: 'pill', color: '#047857' };
  }
};

const MedicationScheduleCard = ({ medications }) => {
  const COLORS = useThemeColors();
  const navigation = useNavigation();

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

  // Distinct icon themes for each medication subcard, with neutral backgrounds
  const getCardTheme = (index) => {
    const iconThemes = [
      {
        icon: 'pill',
        iconColor: '#0F766E' // Teal
      },
      {
        icon: 'bottle-tonic-plus',
        iconColor: '#1D4ED8' // Blue
      },
      {
        icon: 'needle',
        iconColor: '#C2410C' // Orange
      },
      {
        icon: 'pill',
        iconColor: '#6D28D9' // Purple
      }
    ];
    return iconThemes[index % iconThemes.length];
  }
  const isDarkMode = COLORS.background === '#121212';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: COLORS.cardBackground || '#FFFFFF' }]}
      onPress={() => navigation.navigate('Medication')}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerSubtitle}>MEDICATION SCHEDULE</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>ACTIVE</Text>
        </View>
      </View>

      <Text style={[styles.mainTitle, { color: COLORS.text || '#1F2937' }]}>
        {activeCount} Active Prescriptions
      </Text>

      <View style={styles.listContainer}>
        {scheduledDoses.length > 0 ? scheduledDoses.map((med, index) => {
          // Keep identical medication visually consistent using its original index
          const theme = getCardTheme(med.originalIndex);
          const iconShape = getIconForForm(med?.forms?.toLowerCase() || '')?.name || theme.icon;
          const cardBg = isDarkMode ? '#3e3d3dff' : '#F7F9FA';

          let timeDisplay = index === 0 ? '08:00 AM' : '10:00 PM';
          let doseStr = null;

          if (med.doseInstance && med.doseInstance.reception_time) {
            const d = new Date(med.doseInstance.reception_time);


            timeDisplay = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            console.log(timeDisplay);

            const doseValue = med.doseInstance.dose || '1';
            const formStr = med?.forms ? med.forms.toLowerCase() : 'unit';
            const pluralForm = parseInt(doseValue) > 1 && !formStr.endsWith('s') ? `${formStr}s` : formStr;
            doseStr = `${doseValue} ${pluralForm}`;
          }

          return (
            <View key={med._id ? `${med._id}-${index}` : index} style={[styles.medCard, { backgroundColor: cardBg }]}>
              <View style={styles.iconBox}>
                <Icon name={iconShape === 'set-all' ? 'pill' : iconShape} size={22} color={isDarkMode ? '#D1D5DB' : theme.iconColor} />
              </View>

              <View style={styles.medInfo}>
                <Text style={[styles.medName, { color: COLORS.text || '#1F2937' }]}>
                  {med?.medicine_name || (index === 0 ? 'Lisinopril' : 'Atorvastatin')}
                </Text>
                <Text style={[styles.medInstruction, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                  {(med?.strength && med?.unit) ? `${med.strength} ${med.unit} • ${med.description || 'Daily'}` : (index === 0 ? '10mg • Daily with breakfast' : '20mg • Before sleep')}
                </Text>
              </View>

              <View style={styles.timeBox}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[
                    styles.timeText,
                    {
                      color: isDarkMode ? '#D1D5DB' : theme.iconColor,
                      textAlign: 'right'
                    }
                  ]}>
                    {timeDisplay}
                  </Text>

                  {doseStr && (
                    <View style={{ backgroundColor: isDarkMode ? '#4B5563' : (theme.iconColor + '1A'), paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 }}>
                      <Text style={{
                        fontSize: 10,
                        color: isDarkMode ? '#D1D5DB' : theme.iconColor,
                        fontWeight: '600'
                      }}>
                        {doseStr}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }) : (
          <View style={[styles.emptyStateContainer, { backgroundColor: isDarkMode ? '#3e3d3dff' : '#F9FAFB' }]}>
            <View style={[styles.emptyStateIconWrapper, { backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB' }]}>
              <Icon name="emoticon-happy-outline" size={36} color={isDarkMode ? '#D1D5DB' : '#0F766E'} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: COLORS.text || '#1F2937' }]}>All done for today!</Text>
            <Text style={[styles.emptyStateSub, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>You have no medications left to take.</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    color: '#0F766E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  badgeContainer: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 20,
  },
  listContainer: {
    gap: 12,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  medInfo: {
    flex: 1,
    paddingRight: 8,
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  medInstruction: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '400',
  },
  timeBox: {
    minWidth: 90,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyStateContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  emptyStateIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  }
});

export default MedicationScheduleCard;
