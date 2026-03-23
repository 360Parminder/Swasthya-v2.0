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
  console.log("medications", medications);

  const COLORS = useThemeColors();
  const navigation = useNavigation();


  // const activeCount = Object.keys(medications).length > 0 ? medications.length : todaysMedications.length;
  const activeCount = medications?.length;
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
        {medications.map((med, index) => {
          const theme = getCardTheme(index);
          const isDarkMode = COLORS.background === '#121212';
          const cardBg = isDarkMode ? '#3e3d3dff' : '#F7F9FA'; // lighter background

          // Fallback static time for presentation if not present
          const timeDisplay = med?.time || (index === 0 ? '08:00\nAM' : '10:00\nPM');

          return (
            <View key={med.id || index} style={[styles.medCard, { backgroundColor: cardBg }]}>
              <View style={styles.iconBox}>
                <Icon name={theme.icon} size={22} color={isDarkMode ? '#D1D5DB' : theme.iconColor} />
              </View>

              <View style={styles.medInfo}>
                <Text style={[styles.medName, { color: COLORS.text || '#1F2937' }]}>
                  {med?.medicine_name || (index === 0 ? 'Lisinopril' : 'Atorvastatin')}
                </Text>
                <Text style={[styles.medInstruction, { color: isDarkMode ? '#9CA3AF' : '#6B7280' }]}>
                  {(med?.strength && med?.unit) ? `${med.strength}${med.unit} • ${med.description || 'Daily'}` : (index === 0 ? '10mg • Daily with breakfast' : '20mg • Before sleep')}
                </Text>
              </View>

              <View style={styles.timeBox}>
                <Text style={[
                  styles.timeText,
                  { color: isDarkMode ? '#D1D5DB' : theme.iconColor, textAlign: 'right' }
                ]}>
                  {timeDisplay}
                </Text>
              </View>
            </View>
          );
        })}
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
    minWidth: 46,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  }
});

export default MedicationScheduleCard;
