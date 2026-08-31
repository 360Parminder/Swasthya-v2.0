import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Moon02Icon,
  Sun02Icon,
  Tick02Icon,
  ThermometerIcon,
  DropletIcon,
  Pulse01Icon,
  FavouriteIcon,
  SparklesIcon,
  Clock01Icon,
  SlidersHorizontalIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../components/ui/colors';
import { sleepApi } from '../../api/sleepApi';

// ─── Radial Sleep Score Component ───────────────────────────────────
const SleepScoreRing = ({ score = 88, isDark }) => {
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const progressLength = (circumference * clampedScore) / 100;

  return (
    <View style={ringStyles.wrapper}>
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
            stroke="#818CF8"
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <View style={ringStyles.centerContent}>
        <HugeiconsIcon icon={Moon02Icon} size={18} color="#818CF8" />
        <Text style={[ringStyles.scoreNumber, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {clampedScore}%
        </Text>
        <Text style={ringStyles.scoreLabel}>
          {clampedScore >= 85 ? 'OPTIMAL' : clampedScore >= 70 ? 'GOOD' : 'FAIR'}
        </Text>
      </View>
    </View>
  );
};

const ringStyles = StyleSheet.create({
  wrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 0.6,
  },
});

const SleepDetailsScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Live Backend State
  const [sleepData, setSleepData] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Checklist Interactive State
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Digital detox (Screens off 45m prior)', checked: true },
    { id: '2', label: 'Dim ambient lighting & cool room', checked: true },
    { id: '3', label: 'No caffeine after 2:00 PM', checked: true },
    { id: '4', label: '10-minute relaxation / meditation', checked: false },
  ]);

  const loadSleepData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const [currentRes, historyRes] = await Promise.allSettled([
        sleepApi.getCurrentSleep(),
        sleepApi.getSleepHistory(),
      ]);

      if (currentRes.status === 'fulfilled' && currentRes.value?.data?.data?.current) {
        setSleepData(currentRes.value.data.data.current);
      }

      if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value?.data?.data)) {
        setSleepHistory(historyRes.value.data.data);
      }
    } catch (err) {
      console.log('Error loading sleep data:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSleepData(false);
    }, [loadSleepData])
  );

  useEffect(() => {
    loadSleepData(true);
  }, [loadSleepData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSleepData(false);
  };

  const toggleCheckItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.checked).length;

  // Derived metrics from live backend data
  const score = sleepData?.score || 88;
  const hours = sleepData?.duration?.hour ?? 7;
  const minutes = sleepData?.duration?.minute ?? 48;
  const efficiency = sleepData?.efficiency || 94;
  const cycles = sleepData?.cycles || 5;

  const formatTimeStr = (dateVal, fallback) => {
    if (!dateVal) return fallback;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return fallback;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return fallback;
    }
  };

  const bedtimeStr = formatTimeStr(sleepData?.sleepTime, '10:45 PM');
  const wakeTimeStr = formatTimeStr(sleepData?.wakeTime, '06:33 AM');

  // Stages
  const deepMins = sleepData?.stages?.deepMinutes || 112;
  const remMins = sleepData?.stages?.remMinutes || 105;
  const coreMins = sleepData?.stages?.coreMinutes || 221;
  const awakeMins = sleepData?.stages?.awakeMinutes || 30;

  const totalStageMins = deepMins + remMins + coreMins + awakeMins || 468;
  const deepPct = Math.round((deepMins / totalStageMins) * 100);
  const remPct = Math.round((remMins / totalStageMins) * 100);
  const corePct = Math.round((coreMins / totalStageMins) * 100);
  const awakePct = Math.max(0, 100 - (deepPct + remPct + corePct));

  const formatMinDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m < 10 ? '0' : ''}${m}m`;
  };

  // 7-day consistency derived from backend history
  const weekTrend = useMemo(() => {
    const daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLetter = daysMap[d.getDay()];
      const isToday = i === 0;

      const matched = sleepHistory.find((entry) => {
        if (!entry?.sleepTime) return false;
        return new Date(entry.sleepTime).toISOString().split('T')[0] === dateStr;
      });

      const entryHours = isToday
        ? hours + minutes / 60
        : matched
        ? (matched.duration?.hour || 0) + (matched.duration?.minute || 0) / 60
        : 7.2;

      const height = Math.min(Math.max(Math.round((entryHours / 9) * 90), 20), 90);

      result.push({
        day: dayLetter,
        hours: `${entryHours.toFixed(1)}h`,
        height,
        optimal: entryHours >= 7.0,
        isToday,
      });
    }
    return result;
  }, [sleepHistory, hours, minutes]);

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
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Sleep Routine</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Architecture & Recovery</Text>
        </View>

        <TouchableOpacity
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          onPress={() => navigation.navigate('SleepSchedule')}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} size={18} color="#818CF8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#818CF8']}
            tintColor="#818CF8"
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#818CF8" />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Syncing sleep architecture...
            </Text>
          </View>
        ) : (
          <>
            {/* ── Hero Sleep Summary Card ── */}
            <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.heroTopRow}>
                <SleepScoreRing score={score} isDark={isDark} />

                <View style={styles.heroInfoCol}>
                  <View style={styles.heroBadgeRow}>
                    <View style={styles.liveDot} />
                    <Text style={styles.heroBadgeText}>LAST NIGHT'S REST</Text>
                  </View>

                  <Text style={[styles.heroMainTitle, { color: colors.textPrimary }]}>
                    {hours}h {minutes}m Asleep
                  </Text>
                  <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                    Time in bed: {hours}h {minutes + 25}m • {efficiency}% Efficiency
                  </Text>

                  {/* Bedtime & Wake time chips */}
                  <View style={styles.timeChipsRow}>
                    <View style={[styles.timeChip, { backgroundColor: colors.surfaceAlt }]}>
                      <HugeiconsIcon icon={Moon02Icon} size={13} color="#818CF8" />
                      <Text style={[styles.timeChipText, { color: colors.textPrimary }]}>{bedtimeStr}</Text>
                    </View>

                    <Text style={[styles.timeChipArrow, { color: colors.textMuted }]}>→</Text>

                    <View style={[styles.timeChip, { backgroundColor: colors.surfaceAlt }]}>
                      <HugeiconsIcon icon={Sun02Icon} size={13} color="#F59E0B" />
                      <Text style={[styles.timeChipText, { color: colors.textPrimary }]}>{wakeTimeStr}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* ── Sleep Stages Breakdown Card ── */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleWithIcon}>
                  <HugeiconsIcon icon={SparklesIcon} size={16} color="#818CF8" />
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>SLEEP STAGES</Text>
                </View>
                <Text style={[styles.cardHeaderBadge, { color: '#818CF8' }]}>{cycles} CYCLES COMPLETED</Text>
              </View>

              {/* Stacked Multi-Color Stage Gauge */}
              <View style={styles.stageGaugeTrack}>
                <View style={[styles.stageGaugeSegment, { width: `${deepPct}%`, backgroundColor: '#4F46E5' }]} />
                <View style={[styles.stageGaugeSegment, { width: `${remPct}%`, backgroundColor: '#8B5CF6' }]} />
                <View style={[styles.stageGaugeSegment, { width: `${corePct}%`, backgroundColor: '#06B6D4' }]} />
                <View style={[styles.stageGaugeSegment, { width: `${awakePct}%`, backgroundColor: '#F43F5E' }]} />
              </View>

              {/* Stage Details Grid - 2x2 Grid */}
              <View style={styles.stageGrid}>
                <View style={styles.stageRow}>
                  {/* Deep */}
                  <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={styles.stageColorDotRow}>
                      <View style={[styles.stageDot, { backgroundColor: '#4F46E5' }]} />
                      <Text style={[styles.stageName, { color: colors.textSecondary }]}>Deep Sleep</Text>
                    </View>
                    <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>
                      {formatMinDuration(deepMins)}
                    </Text>
                    <Text style={[styles.stagePct, { color: colors.textMuted }]}>{deepPct}% • Physical recovery</Text>
                  </View>

                  {/* REM */}
                  <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={styles.stageColorDotRow}>
                      <View style={[styles.stageDot, { backgroundColor: '#8B5CF6' }]} />
                      <Text style={[styles.stageName, { color: colors.textSecondary }]}>REM Sleep</Text>
                    </View>
                    <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>
                      {formatMinDuration(remMins)}
                    </Text>
                    <Text style={[styles.stagePct, { color: colors.textMuted }]}>{remPct}% • Memory & dreams</Text>
                  </View>
                </View>

                <View style={styles.stageRow}>
                  {/* Core */}
                  <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={styles.stageColorDotRow}>
                      <View style={[styles.stageDot, { backgroundColor: '#06B6D4' }]} />
                      <Text style={[styles.stageName, { color: colors.textSecondary }]}>Core Sleep</Text>
                    </View>
                    <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>
                      {formatMinDuration(coreMins)}
                    </Text>
                    <Text style={[styles.stagePct, { color: colors.textMuted }]}>{corePct}% • Metabolic reset</Text>
                  </View>

                  {/* Awake */}
                  <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={styles.stageColorDotRow}>
                      <View style={[styles.stageDot, { backgroundColor: '#F43F5E' }]} />
                      <Text style={[styles.stageName, { color: colors.textSecondary }]}>Awake Time</Text>
                    </View>
                    <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>
                      {formatMinDuration(awakeMins)}
                    </Text>
                    <Text style={[styles.stagePct, { color: colors.textMuted }]}>{awakePct}% • Micro-arousals</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ── 7-Day Sleep Trend Chart ── */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleWithIcon}>
                  <HugeiconsIcon icon={Clock01Icon} size={16} color="#818CF8" />
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>7-DAY CONSISTENCY</Text>
                </View>
                <Text style={[styles.cardHeaderBadge, { color: '#10B981' }]}>
                  {weekTrend.filter((w) => w.optimal).length}/7 OPTIMAL
                </Text>
              </View>

              <View style={styles.chartBarsContainer}>
                {weekTrend.map((item, index) => (
                  <View key={index} style={styles.chartCol}>
                    <Text style={[styles.chartBarLabel, { color: item.isToday ? '#818CF8' : colors.textMuted }]}>
                      {item.hours}
                    </Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: item.height,
                          backgroundColor: item.isToday
                            ? '#6366F1'
                            : item.optimal
                            ? isDark
                              ? '#312E81'
                              : '#C7D2FE'
                            : isDark
                            ? '#272730'
                            : '#E5E7EB',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.chartDayText,
                        { color: item.isToday ? colors.textPrimary : colors.textMuted },
                        item.isToday && { fontWeight: '800' },
                      ]}
                    >
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Sleep Biometrics Grid ── */}
            <View style={styles.biometricsRow}>
              {/* Heart Rate Dip */}
              <View style={[styles.biometricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.bioIconRow}>
                  <View style={[styles.bioIconBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
                    <HugeiconsIcon icon={FavouriteIcon} size={15} color="#EF4444" />
                  </View>
                  <Text style={[styles.bioLabel, { color: colors.textMuted }]}>HEART DIP</Text>
                </View>
                <Text style={[styles.bioVal, { color: colors.textPrimary }]}>54 <Text style={styles.bioUnit}>bpm</Text></Text>
                <Text style={styles.bioSubSuccess}>-18% Healthy Dip</Text>
              </View>

              {/* Respiratory Rate */}
              <View style={[styles.biometricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.bioIconRow}>
                  <View style={[styles.bioIconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
                    <HugeiconsIcon icon={Pulse01Icon} size={15} color="#3B82F6" />
                  </View>
                  <Text style={[styles.bioLabel, { color: colors.textMuted }]}>RESPIRATION</Text>
                </View>
                <Text style={[styles.bioVal, { color: colors.textPrimary }]}>14.2 <Text style={styles.bioUnit}>rpm</Text></Text>
                <Text style={styles.bioSubNormal}>Normal & Steady</Text>
              </View>
            </View>

            {/* ── Bedtime Wind-Down Checklist ── */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>WIND-DOWN CHECKLIST</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    {completedCount} of {checklist.length} evening habits complete
                  </Text>
                </View>
                <View style={[styles.checklistBadge, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.checklistBadgeText, { color: '#818CF8' }]}>
                    {Math.round((completedCount / checklist.length) * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.checklistWrapper}>
                {checklist.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.checkItem,
                      { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                      item.checked && { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    ]}
                    onPress={() => toggleCheckItem(item.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkCircle,
                        { borderColor: colors.border },
                        item.checked && { backgroundColor: '#6366F1', borderColor: '#6366F1' },
                      ]}
                    >
                      {item.checked && <HugeiconsIcon icon={Tick02Icon} size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                    <Text
                      style={[
                        styles.checkLabelText,
                        { color: colors.textPrimary },
                        item.checked && { color: colors.textSecondary, textDecorationLine: 'line-through' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ── Environmental Hygiene Card ── */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>ENVIRONMENTAL HYGIENE</Text>
                <View style={styles.optimalBadge}>
                  <Text style={styles.optimalBadgeText}>OPTIMAL ZONE</Text>
                </View>
              </View>

              <View style={styles.envGrid}>
                {/* Temp */}
                <View style={[styles.envItem, { backgroundColor: colors.surfaceAlt }]}>
                  <View style={styles.envIconHeader}>
                    <HugeiconsIcon icon={ThermometerIcon} size={16} color="#6366F1" />
                    <Text style={[styles.envLabel, { color: colors.textSecondary }]}>Room Temp</Text>
                  </View>
                  <Text style={[styles.envVal, { color: colors.textPrimary }]}>19.5°C</Text>
                  <Text style={styles.envStatus}>Target 18-20°C</Text>
                </View>

                {/* Humidity */}
                <View style={[styles.envItem, { backgroundColor: colors.surfaceAlt }]}>
                  <View style={styles.envIconHeader}>
                    <HugeiconsIcon icon={DropletIcon} size={16} color="#06B6D4" />
                    <Text style={[styles.envLabel, { color: colors.textSecondary }]}>Humidity</Text>
                  </View>
                  <Text style={[styles.envVal, { color: colors.textPrimary }]}>48%</Text>
                  <Text style={styles.envStatus}>Target 40-50%</Text>
                </View>

                {/* Noise */}
                <View style={[styles.envItem, { backgroundColor: colors.surfaceAlt }]}>
                  <View style={styles.envIconHeader}>
                    <HugeiconsIcon icon={AlertCircleIcon} size={16} color="#10B981" />
                    <Text style={[styles.envLabel, { color: colors.textSecondary }]}>Noise Floor</Text>
                  </View>
                  <Text style={[styles.envVal, { color: colors.textPrimary }]}>28 dB</Text>
                  <Text style={styles.envStatus}>Whisper Quiet</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  navIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
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
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Hero Card ──
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
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroInfoCol: {
    flex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#818CF8',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 0.6,
  },
  heroMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 10,
  },
  timeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeChipArrow: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Standard Card ──
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
    gap: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  cardHeaderBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // ── Sleep Stages ──
  stageGaugeTrack: {
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
    gap: 2,
  },
  stageGaugeSegment: {
    height: '100%',
    borderRadius: 3,
  },
  stageGrid: {
    gap: 10,
  },
  stageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stageItem: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  stageColorDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stageDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  stageName: {
    fontSize: 11,
    fontWeight: '600',
  },
  stageDuration: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  stagePct: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // ── 7-Day Consistency ──
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    paddingTop: 10,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 6,
  },
  chartBar: {
    width: 14,
    borderRadius: 7,
  },
  chartDayText: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: '600',
  },

  // ── Biometrics ──
  biometricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  biometricCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  bioIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bioIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bioVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  bioUnit: {
    fontSize: 11,
    fontWeight: '600',
  },
  bioSubSuccess: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  bioSubNormal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
    marginTop: 2,
  },

  // ── Checklist ──
  checklistBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  checklistBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  checklistWrapper: {
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabelText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  // ── Environmental Hygiene ──
  optimalBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  optimalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  envGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  envItem: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
  },
  envIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  envLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  envVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  envStatus: {
    fontSize: 9,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 2,
  },
});

export default SleepDetailsScreen;
