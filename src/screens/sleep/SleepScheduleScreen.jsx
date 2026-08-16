import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Moon02Icon, Sun02Icon, Clock01Icon } from '@hugeicons/core-free-icons';

// Duration Pill
const DurationPill = ({ value, label, selected, onPress, styles }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.durationPill, selected && styles.durationPillSelected]}
  >
    <Text style={[styles.durationValue, selected && styles.durationValueSelected]}>{value}</Text>
    <Text style={[styles.durationLabel, selected && styles.durationLabelSelected]}>{label}</Text>
  </TouchableOpacity>
);

// Day Circle
const DayCircle = ({ day, active, styles }) => (
  <TouchableOpacity style={[styles.dayCircle, active && styles.dayCircleActive]}>
    <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
  </TouchableOpacity>
);

// Time Display with circular ring
const TimeRing = ({ time, progress, color, styles, borderColor }) => {
  const radius = 52;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * progress;

  return (
    <View style={styles.timeRingContainer}>
      <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
        <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={borderColor || '#E2E8F0'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${circumference}`}
          />
        </G>
      </Svg>
      <Text style={styles.timeRingText}>{time}</Text>
    </View>
  );
};

const SleepScheduleScreen = () => {
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  const [windDownEnabled, setWindDownEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [activeDays, setActiveDays] = useState(['M', 'T', 'W', 'T2', 'F']);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Schedule</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 40 }}>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F8FAFC' }}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Title */}
        <Text style={styles.pageTitle}>Sleep Schedule</Text>
        <Text style={styles.pageSubtitle}>
          Configure your ideal sleep window for better recovery.
        </Text>

        {/* Total Sleep Goal */}
        <View style={styles.goalCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.goalLabel}>TOTAL SLEEP GOAL</Text>
            <Text style={styles.goalValue}>8h 15m</Text>
            <Text style={styles.goalDesc}>
              You are within the recommended range for optimal cognitive function.
            </Text>
          </View>
          <HugeiconsIcon icon={Moon02Icon} size={36} color="rgba(255,255,255,0.15)" />
        </View>

        {/* Bedtime Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeCardHeader}>
            <HugeiconsIcon icon={Moon02Icon} size={22} color={COLORS.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.timeCardTitle}>Bedtime</Text>
              <Text style={styles.timeCardSub}>Wind down starts 22:00</Text>
            </View>
          </View>

          <View style={styles.timeCardBody}>
            <TimeRing time="22:30" progress={0.75} color={COLORS.primary} styles={styles} borderColor={COLORS.border} />
          </View>

          <View style={styles.timeAdjustRow}>
            <TouchableOpacity style={styles.adjustBtn}>
              <Text style={styles.adjustBtnText}>-15m</Text>
            </TouchableOpacity>
            <Text style={styles.periodLabel}>PM</Text>
            <TouchableOpacity style={styles.adjustBtn}>
              <Text style={styles.adjustBtnText}>+15m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wake Up Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeCardHeader}>
            <HugeiconsIcon icon={Sun02Icon} size={22} color={COLORS.warning} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.timeCardTitle}>Wake Up</Text>
              <Text style={styles.timeCardSub}>Smart alarm enabled</Text>
            </View>
          </View>

          <View style={styles.timeCardBody}>
            <TimeRing time="06:45" progress={0.45} color={COLORS.textMuted} styles={styles} borderColor={COLORS.border} />
          </View>

          <View style={styles.timeAdjustRow}>
            <TouchableOpacity style={styles.adjustBtn}>
              <Text style={styles.adjustBtnText}>-15m</Text>
            </TouchableOpacity>
            <Text style={styles.periodLabel}>AM</Text>
            <TouchableOpacity style={styles.adjustBtn}>
              <Text style={styles.adjustBtnText}>+15m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wind-down Reminder */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <HugeiconsIcon icon={Clock01Icon} size={20} color={COLORS.primary} />
              <Text style={styles.sectionCardTitle}>Wind-down Reminder</Text>
            </View>
            <Switch
              value={windDownEnabled}
              onValueChange={setWindDownEnabled}
              trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Time Picker Pill List */}
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Duration before bedtime</Text>
          <View style={styles.durationPillsRow}>
            <DurationPill
              value="15m"
              label="Quick"
              selected={selectedDuration === 15}
              onPress={() => setSelectedDuration(15)}
              styles={styles}
            />
            <DurationPill
              value="30m"
              label="Standard"
              selected={selectedDuration === 30}
              onPress={() => setSelectedDuration(30)}
              styles={styles}
            />
            <DurationPill
              value="45m"
              label="Deep"
              selected={selectedDuration === 45}
              onPress={() => setSelectedDuration(45)}
              styles={styles}
            />
            <DurationPill
              value="60m"
              label="Extended"
              selected={selectedDuration === 60}
              onPress={() => setSelectedDuration(60)}
              styles={styles}
            />
          </View>
        </View>

        {/* Days Active Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Active Days</Text>
          <Text style={styles.cardSectionSub}>
            Apply this schedule on selected days of the week.
          </Text>
          <View style={styles.daysRow}>
            <DayCircle day="S" active={false} styles={styles} />
            <DayCircle day="M" active={true} styles={styles} />
            <DayCircle day="T" active={true} styles={styles} />
            <DayCircle day="W" active={true} styles={styles} />
            <DayCircle day="T" active={true} styles={styles} />
            <DayCircle day="F" active={true} styles={styles} />
            <DayCircle day="S" active={false} styles={styles} />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Sleep Schedule</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 110,
  },

  /* Page Title */
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },

  /* Total Sleep Goal */
  goalCard: {
    backgroundColor: COLORS.primaryHover,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primarySoft,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  goalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.buttonText,
    marginBottom: 8,
    lineHeight: 40,
  },
  goalDesc: {
    fontSize: 12,
    color: COLORS.primarySoft,
    lineHeight: 18,
  },

  /* Time Card */
  timeCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  timeCardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeCardBody: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timeAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  adjustBtn: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  /* Time Ring */
  timeRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timeRingText: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.primary,
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
  },

  /* Duration Pills */
  durationRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  durationPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  durationPillSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  durationValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  durationValueSelected: {
    color: COLORS.primary,
  },
  durationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  durationLabelSelected: {
    color: COLORS.primary,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  /* Repeat Schedule */
  repeatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayTextActive: {
    color: COLORS.buttonText,
  },

  /* Save Button */
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.buttonText,
  },
});

export default SleepScheduleScreen;
