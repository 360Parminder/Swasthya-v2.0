import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Moon02Icon } from '@hugeicons/core-free-icons';

// Duration Pill
const DurationPill = ({ value, label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.durationPill, selected && styles.durationPillSelected]}
  >
    <Text style={[styles.durationValue, selected && styles.durationValueSelected]}>{value}</Text>
    <Text style={[styles.durationLabel, selected && styles.durationLabelSelected]}>{label}</Text>
  </TouchableOpacity>
);

// Day Circle
const DayCircle = ({ day, active }) => (
  <TouchableOpacity style={[styles.dayCircle, active && styles.dayCircleActive]}>
    <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
  </TouchableOpacity>
);

// Time Display with circular ring
const TimeRing = ({ time, progress, color }) => {
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
            stroke="#E2E8F0"
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
  const colors = useThemeColors();

  const [windDownEnabled, setWindDownEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [activeDays, setActiveDays] = useState(['M', 'T', 'W', 'T2', 'F']);

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={colors.primary} strokeWidth={2.5} />
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
          <Icon name="moon" size={36} color="rgba(255,255,255,0.15)" />
        </View>

        {/* Bedtime Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeCardHeader}>
            <Icon name="moon" size={22} color="#0F766E" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.timeCardTitle}>Bedtime</Text>
              <Text style={styles.timeCardSub}>Wind down starts 22:00</Text>
            </View>
          </View>

          <View style={styles.timeCardBody}>
            <TimeRing time="22:30" progress={0.75} color="#0F766E" />
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
            <Icon name="sunny" size={22} color="#F59E0B" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.timeCardTitle}>Wake Up</Text>
              <Text style={styles.timeCardSub}>Smart alarm enabled</Text>
            </View>
          </View>

          <View style={styles.timeCardBody}>
            <TimeRing time="06:45" progress={0.45} color="#94A3B8" />
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
              <Icon name="time-outline" size={20} color="#0F766E" />
              <Text style={styles.sectionCardTitle}>Wind-down Reminder</Text>
            </View>
            <Switch
              value={windDownEnabled}
              onValueChange={setWindDownEnabled}
              trackColor={{ false: '#E2E8F0', true: '#0F766E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {windDownEnabled && (
            <>
              <View style={styles.durationRow}>
                <DurationPill
                  value="30"
                  label="MINS"
                  selected={selectedDuration === 30}
                  onPress={() => setSelectedDuration(30)}
                />
                <DurationPill
                  value="45"
                  label="MINS"
                  selected={selectedDuration === 45}
                  onPress={() => setSelectedDuration(45)}
                />
                <DurationPill
                  value="60"
                  label="MINS"
                  selected={selectedDuration === 60}
                  onPress={() => setSelectedDuration(60)}
                />
              </View>
              <Text style={styles.helperText}>
                This reminder will trigger your phone's "Do Not Disturb" mode and dim your smart lights.
              </Text>
            </>
          )}
        </View>

        {/* Repeat Schedule */}
        <View style={styles.sectionCard}>
          <Text style={styles.repeatTitle}>Repeat Schedule</Text>
          <View style={styles.daysRow}>
            <DayCircle day="S" active={false} />
            <DayCircle day="M" active={true} />
            <DayCircle day="T" active={true} />
            <DayCircle day="W" active={true} />
            <DayCircle day="T" active={true} />
            <DayCircle day="F" active={true} />
            <DayCircle day="S" active={false} />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Sleep Schedule</Text>
        </TouchableOpacity>

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F766E',
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
    color: '#1E293B',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },

  /* Total Sleep Goal */
  goalCard: {
    backgroundColor: '#115E59',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#99F6E4',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  goalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 40,
  },
  goalDesc: {
    fontSize: 12,
    color: '#99F6E4',
    lineHeight: 18,
  },

  /* Time Card */
  timeCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1E293B',
  },
  timeCardSub: {
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
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
    color: '#0F766E',
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1E293B',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  durationPillSelected: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  durationValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B',
  },
  durationValueSelected: {
    color: '#0F766E',
  },
  durationLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  durationLabelSelected: {
    color: '#0F766E',
  },
  helperText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },

  /* Repeat Schedule */
  repeatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#0F766E',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },

  /* Save Button */
  saveButton: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SleepScheduleScreen;
