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
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native'

const HydrationSettingsScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();

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
            <Icon name="water" size={20} color="#FFFFFF" />
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
            <Icon name="water" size={18} color="#0F766E" />
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
              placeholderTextColor="#CBD5E1"
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
            <Icon name="settings-outline" size={18} color="#0F766E" />
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
            <Icon name="calendar-outline" size={18} color="#0F766E" />
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
            <Icon name="notifications-outline" size={18} color="#0F766E" />
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
                <Icon name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>

              <Text style={styles.fieldLabel}>START TIME</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="08:00 AM"
                  placeholderTextColor="#CBD5E1"
                />
                <View style={styles.timeIcons}>
                  <Icon name="sunny-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <Icon name="time-outline" size={18} color="#64748B" />
                </View>
              </View>

              <Text style={styles.fieldLabel}>END TIME</Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="10:00 PM"
                  placeholderTextColor="#CBD5E1"
                />
                <View style={styles.timeIcons}>
                  <Icon name="moon-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <Icon name="time-outline" size={18} color="#64748B" />
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
    color: '#0F766E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },

  /* Smart Advice */
  adviceCard: {
    backgroundColor: '#115E59',
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
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adviceBody: {
    fontSize: 13,
    color: '#CCFBF1',
    lineHeight: 20,
  },
  adviceHighlight: {
    fontWeight: '700',
    color: '#5EEAD4',
    textDecorationLine: 'underline',
  },

  /* Cards */
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F5156',
    marginLeft: 10,
  },

  /* Field Label */
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },

  /* Text Input */
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  unitBadge: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  unitBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Quick Set */
  quickSetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickSetButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickSetText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Toggle */
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  toggleBtnTextActive: {
    color: '#0F5156',
  },
  helperText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },

  /* Weekly Outlook */
  totalPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  totalPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
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
    color: '#64748B',
    letterSpacing: 0.5,
  },
  adjustBtn: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Select Box */
  selectBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#1E293B',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vibrateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  vibrateSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },

  /* Save / Restore */
  saveButton: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default HydrationSettingsScreen;
