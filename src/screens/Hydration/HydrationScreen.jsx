import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  DropletIcon,
  SlidersHorizontalIcon,
  Calendar03Icon,
  SparklesIcon,
  Clock01Icon,
  Coffee01Icon,
  Coffee02Icon,
  PlusSignIcon,
  Delete02Icon,
  FlashIcon,
} from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../components/ui/colors';

// ─── Radial Hydration Progress Ring ─────────────────────────────────
const HydrationRing = ({ current = 1850, goal = 2500, isDark }) => {
  const size = 114;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const progressLength = (circumference * percentage) / 100;

  return (
    <View style={ringStyles.wrapper}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#06B6D4" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>
        </Defs>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? '#1E293B' : '#E2E8F0'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#waterGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progressLength}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View style={ringStyles.centerContent}>
        <HugeiconsIcon icon={DropletIcon} size={20} color="#0284C7" />
        <Text style={[ringStyles.scoreNumber, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          {percentage}%
        </Text>
        <Text style={ringStyles.scoreLabel}>OPTIMAL</Text>
      </View>
    </View>
  );
};

const ringStyles = StyleSheet.create({
  wrapper: {
    width: 114,
    height: 114,
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
    color: '#0284C7',
    letterSpacing: 0.6,
  },
});

// ─── Main Hydration Screen ──────────────────────────────────────────
const HydrationScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // Hydration Goal & Current State
  const [dailyGoal] = useState(2500); // 2.5 Liters
  const [logs, setLogs] = useState([
    { id: '1', title: 'Sports Bottle', amount: 500, time: '10:45 AM', icon: Coffee02Icon },
    { id: '2', title: 'Herbal Tea / Mug', amount: 350, time: '09:15 AM', icon: Coffee01Icon },
    { id: '3', title: 'Small Glass', amount: 200, time: '08:30 AM', icon: DropletIcon },
    { id: '4', title: 'Sports Bottle', amount: 500, time: '06:45 AM', icon: Coffee02Icon },
    { id: '5', title: 'Morning Glass', amount: 300, time: '06:15 AM', icon: DropletIcon },
  ]);

  // Derived Total
  const totalWater = useMemo(() => {
    return logs.reduce((sum, item) => sum + item.amount, 0);
  }, [logs]);

  const percentage = Math.min(Math.round((totalWater / dailyGoal) * 100), 100);
  const remaining = Math.max(dailyGoal - totalWater, 0);

  // Quick Preset Add Handlers
  const handleQuickAdd = (title, amount, icon) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: Date.now().toString(),
      title,
      amount,
      time: timeStr,
      icon,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteLog = (id) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const QUICK_PRESETS = [
    { title: 'Small Glass', amount: 200, label: '200 ml', icon: DropletIcon, badge: 'Sip' },
    { title: 'Cup / Mug', amount: 350, label: '350 ml', icon: Coffee01Icon, badge: 'Tea/Coffee' },
    { title: 'Sports Bottle', amount: 500, label: '500 ml', icon: Coffee02Icon, badge: 'Standard' },
    { title: 'Large Flask', amount: 750, label: '750 ml', icon: DropletIcon, badge: 'Deep Hydration' },
  ];

  const WEEK_TREND = [
    { day: 'M', amount: '2.4L', pct: 96, optimal: true },
    { day: 'T', amount: '2.1L', pct: 84, optimal: true },
    { day: 'W', amount: '2.6L', pct: 104, optimal: true },
    { day: 'T', amount: '1.9L', pct: 76, optimal: false },
    { day: 'F', amount: '2.5L', pct: 100, optimal: true },
    { day: 'S', amount: '2.2L', pct: 88, optimal: true },
    { day: 'S', amount: '1.85L', pct: percentage, optimal: true, isToday: true },
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
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Hydration Tracker</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Intake & Cellular Balance</Text>
        </View>

        <View style={styles.navActionsRow}>
          <TouchableOpacity
            style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            onPress={() => navigation.navigate('HydrationHistory')}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Calendar03Icon} size={18} color="#0284C7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, marginLeft: 8 }]}
            onPress={() => navigation.navigate('HydrationSettings')}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={SlidersHorizontalIcon} size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Hydration Status Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroLeft}>
            <View style={styles.heroBadgeRow}>
              <View style={[styles.badgePill, { backgroundColor: isDark ? '#082F49' : '#E0F2FE' }]}>
                <HugeiconsIcon icon={SparklesIcon} size={12} color="#0284C7" />
                <Text style={[styles.badgePillText, { color: '#0284C7' }]}>
                  {percentage >= 100 ? 'GOAL ACHIEVED' : `${percentage}% OF TARGET`}
                </Text>
              </View>
            </View>

            <View style={styles.heroIntakeDisplay}>
              <Text style={[styles.heroBigNumber, { color: colors.textPrimary }]}>
                {(totalWater / 1000).toFixed(2)}
              </Text>
              <Text style={[styles.heroUnitText, { color: colors.textSecondary }]}>
                L
              </Text>
            </View>

            <Text style={[styles.heroGoalSubtext, { color: colors.textMuted }]}>
              Goal: {(dailyGoal / 1000).toFixed(1)} L • {remaining > 0 ? `${remaining} ml to go` : 'Target met!'}
            </Text>

            <View style={[styles.pacingChip, { backgroundColor: colors.surfaceAlt }]}>
              <HugeiconsIcon icon={FlashIcon} size={13} color="#0284C7" />
              <Text style={[styles.pacingChipText, { color: colors.textSecondary }]}>
                Next intake recommended in 35m
              </Text>
            </View>
          </View>

          <View style={styles.heroRight}>
            <HydrationRing current={totalWater} goal={dailyGoal} isDark={isDark} />
          </View>
        </View>

        {/* ── 1-Tap Quick Intake Logger (2x2 Grid) ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <HugeiconsIcon icon={DropletIcon} size={16} color="#0284C7" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>LOG WATER INTAKE</Text>
            </View>
            <Text style={[styles.cardHeaderBadge, { color: '#0284C7' }]}>1-TAP ADD</Text>
          </View>

          <View style={styles.presetGrid}>
            <View style={styles.presetRow}>
              {QUICK_PRESETS.slice(0, 2).map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.presetCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                  onPress={() => handleQuickAdd(item.title, item.amount, item.icon)}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetTopRow}>
                    <View style={[styles.presetIconWrap, { backgroundColor: isDark ? '#0C4A6E' : '#E0F2FE' }]}>
                      <HugeiconsIcon icon={item.icon} size={18} color="#0284C7" />
                    </View>
                    <View style={styles.plusPill}>
                      <HugeiconsIcon icon={PlusSignIcon} size={12} color="#0284C7" />
                      <Text style={styles.plusPillText}>Add</Text>
                    </View>
                  </View>
                  <Text style={[styles.presetAmount, { color: colors.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.presetTitle, { color: colors.textSecondary }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.presetRow}>
              {QUICK_PRESETS.slice(2, 4).map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.presetCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                  onPress={() => handleQuickAdd(item.title, item.amount, item.icon)}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetTopRow}>
                    <View style={[styles.presetIconWrap, { backgroundColor: isDark ? '#0C4A6E' : '#E0F2FE' }]}>
                      <HugeiconsIcon icon={item.icon} size={18} color="#0284C7" />
                    </View>
                    <View style={styles.plusPill}>
                      <HugeiconsIcon icon={PlusSignIcon} size={12} color="#0284C7" />
                      <Text style={styles.plusPillText}>Add</Text>
                    </View>
                  </View>
                  <Text style={[styles.presetAmount, { color: colors.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.presetTitle, { color: colors.textSecondary }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Hydration Telemetry Breakdown (2x2 Grid) ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <HugeiconsIcon icon={SparklesIcon} size={16} color="#0284C7" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>HYDRATION METRICS</Text>
            </View>
            <Text style={[styles.cardHeaderBadge, { color: '#0284C7' }]}>{logs.length} LOGS TODAY</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <View style={[styles.metricBox, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total Volume</Text>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{totalWater} ml</Text>
                <Text style={[styles.metricSub, { color: '#0284C7' }]}>{percentage}% achieved</Text>
              </View>

              <View style={[styles.metricBox, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Target Remaining</Text>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>{remaining} ml</Text>
                <Text style={[styles.metricSub, { color: colors.textMuted }]}>{(remaining / 250).toFixed(1)} glasses</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={[styles.metricBox, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Avg Drink Size</Text>
                <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                  {logs.length > 0 ? Math.round(totalWater / logs.length) : 0} ml
                </Text>
                <Text style={[styles.metricSub, { color: colors.textMuted }]}>Consistent intake</Text>
              </View>

              <View style={[styles.metricBox, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Metabolic Pacing</Text>
                <Text style={[styles.metricValue, { color: '#10B981' }]}>Optimal</Text>
                <Text style={[styles.metricSub, { color: colors.textMuted }]}>Kidney reset</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 7-Day Consistency Bar Chart ── */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('HydrationHistory')}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <HugeiconsIcon icon={Clock01Icon} size={16} color="#0284C7" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>7-DAY CONSISTENCY</Text>
            </View>
            <Text style={[styles.cardHeaderBadge, { color: '#10B981' }]}>AVG 2.2L</Text>
          </View>

          <View style={styles.chartBarsContainer}>
            {WEEK_TREND.map((item, idx) => (
              <View key={idx} style={styles.chartBarCol}>
                <Text style={[styles.chartBarTopText, { color: item.isToday ? '#0284C7' : colors.textMuted }]}>
                  {item.amount}
                </Text>
                <View style={[styles.chartBarTrack, { backgroundColor: colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: `${Math.min(item.pct, 100)}%`,
                        backgroundColor: item.isToday ? '#0284C7' : (item.optimal ? '#38BDF8' : '#F43F5E'),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.chartDayText, { color: item.isToday ? '#0284C7' : colors.textSecondary, fontWeight: item.isToday ? '800' : '600' }]}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* ── Today's Intake Log Timeline ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWithIcon}>
              <HugeiconsIcon icon={DropletIcon} size={16} color="#0284C7" />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>TODAY'S INTAKE TIMELINE</Text>
            </View>
            <Text style={[styles.cardHeaderBadge, { color: colors.textMuted }]}>{logs.length} ENTRIES</Text>
          </View>

          {logs.length === 0 ? (
            <View style={styles.emptyLogBox}>
              <Text style={[styles.emptyLogText, { color: colors.textMuted }]}>
                No water intake logged yet today.
              </Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {logs.map((item, idx) => {
                const ItemIcon = item.icon || DropletIcon;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.logRow,
                      {
                        borderBottomColor: colors.border,
                        borderBottomWidth: idx === logs.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <View style={styles.logLeft}>
                      <View style={[styles.logIconBox, { backgroundColor: isDark ? '#082F49' : '#E0F2FE' }]}>
                        <HugeiconsIcon icon={ItemIcon} size={18} color="#0284C7" />
                      </View>
                      <View style={styles.logTexts}>
                        <Text style={[styles.logTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                        <Text style={[styles.logTime, { color: colors.textMuted }]}>Logged at {item.time}</Text>
                      </View>
                    </View>

                    <View style={styles.logRight}>
                      <Text style={[styles.logAmount, { color: '#0284C7' }]}>+{item.amount} ml</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteLog(item.id)}
                        style={styles.logDeleteBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={15} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Clinical Insight Card ── */}
        <View style={[styles.insightCard, { backgroundColor: isDark ? '#0C4A6E' : '#F0F9FF', borderColor: '#BAE6FD' }]}>
          <View style={styles.insightHeaderRow}>
            <View style={[styles.insightIconWrap, { backgroundColor: '#0284C7' }]}>
              <HugeiconsIcon icon={SparklesIcon} size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.insightHeading}>Clinical Pacing Insight</Text>
          </View>
          <Text style={[styles.insightBody, { color: isDark ? '#BAE6FD' : '#0369A1' }]}>
            Drinking 250ml every 90 minutes provides optimal renal filtration and avoids cellular fatigue compared to drinking large volumes at once.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles matching SleepDetailsScreen & Modern Suite ──────────────
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
  navActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

  // ── Hero Card ──
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroIntakeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroBigNumber: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroUnitText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 4,
  },
  heroGoalSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 12,
  },
  pacingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pacingChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Standard Card Container ──
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
  cardHeaderBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // ── 1-Tap Quick Logger 2x2 Grid ──
  presetGrid: {
    gap: 10,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  presetIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  plusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  presetAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  presetTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // ── Metrics Breakdown 2x2 ──
  metricsGrid: {
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },

  // ── 7-Day Consistency Chart ──
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarTopText: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 6,
  },
  chartBarTrack: {
    width: 14,
    height: 90,
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 7,
  },
  chartDayText: {
    fontSize: 11,
    marginTop: 8,
  },

  // ── Intake Timeline ──
  emptyLogBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyLogText: {
    fontSize: 13,
  },
  timelineList: {
    marginTop: 2,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logTexts: {
    gap: 2,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  logTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  logRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  logDeleteBtn: {
    padding: 4,
  },

  // ── Clinical Insight Card ──
  insightCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.2,
  },
  insightBody: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default HydrationScreen;
