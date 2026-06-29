import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { ArrowLeft01Icon, DropletIcon, Settings02Icon, Calendar01Icon, Notification03Icon, ArrowDown01Icon, Sun02Icon, Clock01Icon, Moon02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

const HydrationSettingsScreen = () => {
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  const [targetIntake, setTargetIntake] = useState('2000');
  const [metricActive, setMetricActive] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [vibrateOnly, setVibrateOnly] = useState(false);
  const [frequency, setFrequency] = useState('Every 1 hour');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('10:00 PM');

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hydration Settings</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: '#F8FAFC' }}
      >

        {/* Smart Advice Banner */}
        <View style={styles.adviceCard}>
          <View style={styles.adviceIconCircle}>
            <HugeiconsIcon icon={DropletIcon} size={20} color={COLORS.buttonText} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.adviceTitle}>Smart Advice</Text>
            <Text style={styles.adviceBody}>
              Based on your activity level and weight (74kg), we recommend a daily goal of{' '}
              <Text style={styles.adviceHighlight}>2.4L</Text> today to stay optimally hydrated.
            </Text>
          </View>
        </View>

        {/* Daily Goal Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HugeiconsIcon icon={DropletIcon} size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Daily Goal</Text>
          </View>

          <Text style={styles.fieldLabel}>TARGET INTAKE</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={targetIntake}
              onChangeText={setTargetIntake}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={COLORS.placeholder}
            />
            <View style={styles.unitBadge}>
              <Text style={styles.unitBadgeText}>ml</Text>
            </View>
          </View>
          <View style={styles.quickSetRow}>
            <TouchableOpacity
              style={styles.quickSetButton}
              onPress={() => setTargetIntake('2500')}
            >
              <Text style={styles.quickSetText}>QUICK SET: 2.5L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickSetButton}
              onPress={() => setTargetIntake('3000')}
            >
              <Text style={styles.quickSetText}>QUICK SET: 3.0L</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Measurement Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HugeiconsIcon icon={Settings02Icon} size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Measurement</Text>
          </View>

          <Text style={styles.fieldLabel}>SYSTEM PREFERENCE</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, metricActive && styles.toggleBtnActive]}
              onPress={() => setMetricActive(true)}
            >
              <Text style={[styles.toggleBtnText, metricActive && styles.toggleBtnTextActive]}>
                Metric (L, ml)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !metricActive && styles.toggleBtnActive]}
              onPress={() => setMetricActive(false)}
            >
              <Text style={[styles.toggleBtnText, !metricActive && styles.toggleBtnTextActive]}>
                Imperial (oz)
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Changing units will convert all historical hydration logs to the new system.
          </Text>
        </View>

        {/* Weekly Outlook Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HugeiconsIcon icon={Calendar01Icon} size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Weekly Outlook</Text>
            <View style={styles.totalPill}>
              <Text style={styles.totalPillText}>Total: 14.0L</Text>
            </View>
          </View>

          <View style={styles.weekRow}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.adjustBtn}>
            <Text style={styles.adjustBtnText}>Adjust specific days</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Protocol Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <HugeiconsIcon icon={Notification03Icon} size={18} color={COLORS.primary} />
            <Text style={[styles.cardTitle, { flex: 1 }]}>Reminder Protocol</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#E2E8F0', true: '#0F766E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {reminderEnabled && (
            <>
              <Text style={styles.fieldLabel}>FREQUENCY</Text>
              <TouchableOpacity style={styles.selectBox}>
                <Text style={styles.selectBoxText}>{frequency}</Text>
                <HugeiconsIcon icon={ArrowDown01Icon} size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.fieldLabel}>START TIME</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="08:00 AM"
                  placeholderTextColor={COLORS.placeholder}
                />
                <View style={styles.timeIcons}>
                  <HugeiconsIcon icon={Sun02Icon} size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                  <HugeiconsIcon icon={Clock01Icon} size={18} color={COLORS.textSecondary} />
                </View>
              </View>

              <Text style={styles.fieldLabel}>END TIME</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="10:00 PM"
                  placeholderTextColor={COLORS.placeholder}
                />
                <View style={styles.timeIcons}>
                  <HugeiconsIcon icon={Moon02Icon} size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                  <HugeiconsIcon icon={Clock01Icon} size={18} color={COLORS.textSecondary} />
                </View>
              </View>

              {/* Vibrate sub-card */}
              <View style={styles.vibrateCard}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.vibrateTitle}>Vibrate Only during meetings</Text>
                  <Text style={styles.vibrateSubtitle}>Synchronizes with your device calendar</Text>
                </View>
                <Switch
                  value={vibrateOnly}
                  onValueChange={setVibrateOnly}
                  trackColor={{ false: '#E2E8F0', true: '#0F766E' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>

        {/* Restore Defaults */}
        <TouchableOpacity style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Default Settings</Text>
        </TouchableOpacity>

      </ScrollView>
    </>
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
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },

  /* Smart Advice */
  adviceCard: {
    backgroundColor: COLORS.primaryHover,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  adviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.buttonText,
    marginBottom: 4,
  },
  adviceBody: {
    fontSize: 13,
    color: COLORS.primarySoft,
    lineHeight: 20,
  },
  adviceHighlight: {
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },

  /* Cards */
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryHover,
    marginLeft: 10,
  },

  /* Field Label */
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },

  /* Text Input */
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: COLORS.cardBackground,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  unitBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  unitBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.buttonText,
  },

  /* Quick Set */
  quickSetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickSetButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickSetText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  /* Toggle */
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  toggleBtnTextActive: {
    color: COLORS.primaryHover,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  /* Weekly Outlook */
  totalPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  totalPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  adjustBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },

  /* Select Box */
  selectBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  selectBoxText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  /* Time Row */
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  /* Vibrate sub-card */
  vibrateCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vibrateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  vibrateSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  /* Save / Restore */
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.buttonText,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default HydrationSettingsScreen;
