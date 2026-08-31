import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Moon02Icon,
  Sun02Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import Toast from 'react-native-toast-message';
import { useThemeColors } from '../../components/ui/colors';
import { sleepApi } from '../../api/sleepApi';

// ─── Time Dial Display ──────────────────────────────────────────────
const TimeDial = ({ timeStr, progress = 0.75, color = '#6366F1', isDark, icon: IconComponent }) => {
  const size = 96;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * progress;

  return (
    <View style={dialStyles.wrapper}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <View style={dialStyles.centerContent}>
        {IconComponent && <HugeiconsIcon icon={IconComponent} size={16} color={color} />}
        <Text style={[dialStyles.timeText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {timeStr}
        </Text>
      </View>
    </View>
  );
};

const dialStyles = StyleSheet.create({
  wrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});

const SleepScheduleScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Bedtime (minutes from midnight: 22:30 -> 1350)
  const [bedtimeMinutes, setBedtimeMinutes] = useState(22 * 60 + 30);
  // Wakeup (minutes from midnight: 06:45 -> 405)
  const [wakeMinutes, setWakeMinutes] = useState(6 * 60 + 45);

  const [windDownEnabled, setWindDownEnabled] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [smartAlarmEnabled, setSmartAlarmEnabled] = useState(true);
  const [activeDays, setActiveDays] = useState(['M', 'T', 'W', 'TH', 'F']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await sleepApi.getSleepSchedule();
        if (res?.data?.data) {
          const s = res.data.data;
          if (s.bedtimeMinutes !== undefined) setBedtimeMinutes(s.bedtimeMinutes);
          if (s.wakeMinutes !== undefined) setWakeMinutes(s.wakeMinutes);
          if (s.activeDays && Array.isArray(s.activeDays)) setActiveDays(s.activeDays);
          if (s.windDownReminder !== undefined) setWindDownEnabled(s.windDownReminder);
          if (s.reminderLeadTime !== undefined) setSelectedDuration(s.reminderLeadTime);
          if (s.smartAlarmEnabled !== undefined) setSmartAlarmEnabled(s.smartAlarmEnabled);
        }
      } catch (err) {
        console.log('Error fetching sleep schedule:', err);
      }
    };
    fetchSchedule();
  }, []);

  const adjustBedtime = (deltaMinutes) => {
    setBedtimeMinutes((prev) => {
      let next = (prev + deltaMinutes) % 1440;
      if (next < 0) next += 1440;
      return next;
    });
  };

  const adjustWakeTime = (deltaMinutes) => {
    setWakeMinutes((prev) => {
      let next = (prev + deltaMinutes) % 1440;
      if (next < 0) next += 1440;
      return next;
    });
  };

  const formatMinutesToTime = (totalMinutes) => {
    const hours24 = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minStr = String(mins).padStart(2, '0');
    return {
      formatted: `${hours12}:${minStr}`,
      period,
      full: `${hours12}:${minStr} ${period}`,
    };
  };

  const bedtimeObj = useMemo(() => formatMinutesToTime(bedtimeMinutes), [bedtimeMinutes]);
  const wakeObj = useMemo(() => formatMinutesToTime(wakeMinutes), [wakeMinutes]);

  // Calculate total sleep duration
  const totalSleepMinutes = useMemo(() => {
    let diff = wakeMinutes - bedtimeMinutes;
    if (diff < 0) diff += 1440;
    return diff;
  }, [bedtimeMinutes, wakeMinutes]);

  const totalHours = Math.floor(totalSleepMinutes / 60);
  const remainingMins = totalSleepMinutes % 60;
  const cycleCount = (totalSleepMinutes / 90).toFixed(1);

  const toggleDay = (dayKey) => {
    setActiveDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await sleepApi.updateSleepSchedule({
        bedtimeMinutes,
        wakeMinutes,
        activeDays,
        windDownReminder: windDownEnabled,
        reminderLeadTime: selectedDuration,
        smartAlarmEnabled,
      });

      Toast.show({
        type: 'success',
        text1: 'Schedule Saved',
        text2: `Target ${totalHours}h ${remainingMins}m sleep window active.`,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 350);
    } catch (err) {
      console.log('Error saving sleep schedule:', err);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not sync schedule to server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const daysList = [
    { key: 'S1', label: 'S' },
    { key: 'M', label: 'M' },
    { key: 'T', label: 'T' },
    { key: 'W', label: 'W' },
    { key: 'TH', label: 'T' },
    { key: 'F', label: 'F' },
    { key: 'S2', label: 'S' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* ── Top Navigation Bar ── */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Sleep Schedule</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Target Window & Alarms</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Target Goal Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroBadgeRow}>
              <HugeiconsIcon icon={SparklesIcon} size={14} color="#818CF8" />
              <Text style={styles.heroBadgeText}>TARGET SLEEP GOAL</Text>
            </View>
            <View style={[styles.cyclesBadge, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF' }]}>
              <Text style={[styles.cyclesBadgeText, { color: '#6366F1' }]}>~{cycleCount} Cycles</Text>
            </View>
          </View>

          <Text style={[styles.heroValText, { color: colors.textPrimary }]}>
            {totalHours}h {remainingMins > 0 ? `${remainingMins}m` : '00m'}
          </Text>
          <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
            Provides {cycleCount} full 90-minute restorative sleep cycles for optimal energy.
          </Text>
        </View>

        {/* ── Bedtime Adjust Card ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <View style={[styles.cardIconBox, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF' }]}>
                <HugeiconsIcon icon={Moon02Icon} size={18} color="#6366F1" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Bedtime</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Wind down begins at {bedtimeObj.full}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.adjustRow}>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={() => adjustBedtime(-15)}
              activeOpacity={0.7}
            >
              <Text style={[styles.adjustBtnText, { color: colors.textPrimary }]}>-15m</Text>
            </TouchableOpacity>

            <TimeDial
              timeStr={bedtimeObj.formatted}
              progress={0.78}
              color="#6366F1"
              isDark={isDark}
              icon={Moon02Icon}
            />

            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={() => adjustBedtime(15)}
              activeOpacity={0.7}
            >
              <Text style={[styles.adjustBtnText, { color: colors.textPrimary }]}>+15m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Wake Up Adjust Card ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <View style={[styles.cardIconBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
                <HugeiconsIcon icon={Sun02Icon} size={18} color="#F59E0B" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Wake Up</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  Alarm set for {wakeObj.full}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.adjustRow}>
            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={() => adjustWakeTime(-15)}
              activeOpacity={0.7}
            >
              <Text style={[styles.adjustBtnText, { color: colors.textPrimary }]}>-15m</Text>
            </TouchableOpacity>

            <TimeDial
              timeStr={wakeObj.formatted}
              progress={0.35}
              color="#F59E0B"
              isDark={isDark}
              icon={Sun02Icon}
            />

            <TouchableOpacity
              style={[styles.adjustBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
              onPress={() => adjustWakeTime(15)}
              activeOpacity={0.7}
            >
              <Text style={[styles.adjustBtnText, { color: colors.textPrimary }]}>+15m</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Wind-Down Reminder Card ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.toggleHeaderRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Wind-Down Reminder</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Notification alert before bedtime
              </Text>
            </View>
            <Switch
              value={windDownEnabled}
              onValueChange={setWindDownEnabled}
              trackColor={{ false: colors.border, true: '#6366F1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {windDownEnabled && (
            <View style={styles.durationPillsContainer}>
              <Text style={[styles.durationLabel, { color: colors.textMuted }]}>REMINDER LEAD TIME</Text>
              <View style={styles.durationPillsRow}>
                {[
                  { val: 15, label: '15m', sub: 'Quick' },
                  { val: 30, label: '30m', sub: 'Standard' },
                  { val: 45, label: '45m', sub: 'Optimal' },
                  { val: 60, label: '60m', sub: 'Relax' },
                ].map((item) => {
                  const isSelected = selectedDuration === item.val;
                  return (
                    <TouchableOpacity
                      key={item.val}
                      style={[
                        styles.durationPill,
                        isSelected
                          ? { backgroundColor: '#6366F1', borderColor: '#6366F1' }
                          : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                      ]}
                      onPress={() => setSelectedDuration(item.val)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.durationPillVal,
                          { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={[
                          styles.durationPillSub,
                          { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.textMuted },
                        ]}
                      >
                        {item.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* ── Smart Gentle Alarm Card ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.toggleHeaderRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Smart Light Alarm</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Gradual volume ramp up in light sleep window
              </Text>
            </View>
            <Switch
              value={smartAlarmEnabled}
              onValueChange={setSmartAlarmEnabled}
              trackColor={{ false: colors.border, true: '#F59E0B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── Active Days Selector ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Active Schedule Days</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary, marginBottom: 14 }]}>
            Choose days of week to apply this bedtime routine
          </Text>

          <View style={styles.daysRow}>
            {daysList.map((d) => {
              const isActive = activeDays.includes(d.key);
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.dayCircle,
                    isActive
                      ? { backgroundColor: '#6366F1', borderColor: '#6366F1' }
                      : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  ]}
                  onPress={() => toggleDay(d.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isActive ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.88}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Sleep Routine</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  navSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#818CF8',
  },
  cyclesBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cyclesBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroValText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },

  // Generic Card
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  // Adjust Row
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  adjustBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  adjustBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Toggle Header
  toggleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 16,
  },

  // Duration Pills
  durationPillsContainer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  durationLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  durationPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPillVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  durationPillSub: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // Active Days
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 15,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default SleepScheduleScreen;
