import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

const { width } = Dimensions.get('window');

// ─── Radial Sleep Score Component ───────────────────────────────────
const SleepScoreRing = ({ score = 88, isDark }) => {
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressLength = (circumference * score) / 100;

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
            stroke="#6366F1"
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
          {score}%
        </Text>
        <Text style={ringStyles.scoreLabel}>OPTIMAL</Text>
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

  // Checklist Interactive State
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Digital detox (Screens off 45m prior)', checked: true },
    { id: '2', label: 'Dim ambient lighting & cool room', checked: true },
    { id: '3', label: 'No caffeine after 2:00 PM', checked: true },
    { id: '4', label: '10-minute relaxation / meditation', checked: false },
  ]);

  const toggleCheckItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.checked).length;

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
      >
        {/* ── Hero Sleep Summary Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroTopRow}>
            <SleepScoreRing score={88} isDark={isDark} />

            <View style={styles.heroInfoCol}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.liveDot} />
                <Text style={styles.heroBadgeText}>LAST NIGHT'S REST</Text>
              </View>

              <Text style={[styles.heroMainTitle, { color: colors.textPrimary }]}>7h 48m Asleep</Text>
              <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                Time in bed: 8h 15m • 94% Efficiency
              </Text>

              {/* Bedtime & Wake time chips */}
              <View style={styles.timeChipsRow}>
                <View style={[styles.timeChip, { backgroundColor: colors.surfaceAlt }]}>
                  <HugeiconsIcon icon={Moon02Icon} size={13} color="#818CF8" />
                  <Text style={[styles.timeChipText, { color: colors.textPrimary }]}>10:45 PM</Text>
                </View>

                <Text style={[styles.timeChipArrow, { color: colors.textMuted }]}>→</Text>

                <View style={[styles.timeChip, { backgroundColor: colors.surfaceAlt }]}>
                  <HugeiconsIcon icon={Sun02Icon} size={13} color="#F59E0B" />
                  <Text style={[styles.timeChipText, { color: colors.textPrimary }]}>06:33 AM</Text>
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
            <Text style={[styles.cardHeaderBadge, { color: '#818CF8' }]}>5 CYCLES COMPLETED</Text>
          </View>

          {/* Stacked Multi-Color Stage Gauge */}
          <View style={styles.stageGaugeTrack}>
            <View style={[styles.stageGaugeSegment, { width: '24%', backgroundColor: '#4F46E5' }]} />
            <View style={[styles.stageGaugeSegment, { width: '22%', backgroundColor: '#8B5CF6' }]} />
            <View style={[styles.stageGaugeSegment, { width: '47%', backgroundColor: '#06B6D4' }]} />
            <View style={[styles.stageGaugeSegment, { width: '7%', backgroundColor: '#F43F5E' }]} />
          </View>

          {/* Stage Details Grid */}
          <View style={styles.stageGrid}>
            {/* Deep */}
            <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
              <View style={styles.stageColorDotRow}>
                <View style={[styles.stageDot, { backgroundColor: '#4F46E5' }]} />
                <Text style={[styles.stageName, { color: colors.textSecondary }]}>Deep Sleep</Text>
              </View>
              <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>1h 52m</Text>
              <Text style={[styles.stagePct, { color: colors.textMuted }]}>24% • Physical recovery</Text>
            </View>

            {/* REM */}
            <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
              <View style={styles.stageColorDotRow}>
                <View style={[styles.stageDot, { backgroundColor: '#8B5CF6' }]} />
                <Text style={[styles.stageName, { color: colors.textSecondary }]}>REM Sleep</Text>
              </View>
              <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>1h 45m</Text>
              <Text style={[styles.stagePct, { color: colors.textMuted }]}>22% • Memory & dreams</Text>
            </View>

            {/* Core */}
            <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
              <View style={styles.stageColorDotRow}>
                <View style={[styles.stageDot, { backgroundColor: '#06B6D4' }]} />
                <Text style={[styles.stageName, { color: colors.textSecondary }]}>Core Sleep</Text>
              </View>
              <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>3h 41m</Text>
              <Text style={[styles.stagePct, { color: colors.textMuted }]}>47% • Metabolic reset</Text>
            </View>

            {/* Awake */}
            <View style={[styles.stageItem, { backgroundColor: colors.surfaceAlt }]}>
              <View style={styles.stageColorDotRow}>
                <View style={[styles.stageDot, { backgroundColor: '#F43F5E' }]} />
                <Text style={[styles.stageName, { color: colors.textSecondary }]}>Awake Time</Text>
              </View>
              <Text style={[styles.stageDuration, { color: colors.textPrimary }]}>0h 30m</Text>
              <Text style={[styles.stagePct, { color: colors.textMuted }]}>7% • Micro-arousals</Text>
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
            <Text style={[styles.cardHeaderBadge, { color: '#10B981' }]}>AVG 7h 42m</Text>
          </View>

          <View style={styles.chartBarsContainer}>
            {[
              { day: 'M', hours: '7.5h', height: 60, optimal: true },
              { day: 'T', hours: '7.2h', height: 55, optimal: true },
              { day: 'W', hours: '8.1h', height: 75, optimal: true },
              { day: 'T', hours: '6.8h', height: 48, optimal: false },
              { day: 'F', hours: '7.8h', height: 68, optimal: true },
              { day: 'S', hours: '8.4h', height: 82, optimal: true },
              { day: 'S', hours: '7.9h', height: 70, isToday: true, optimal: true },
            ].map((item, index) => (
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
                    { color: item.checked ? colors.textPrimary : colors.textSecondary },
                    item.checked && styles.checkLabelChecked,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Room Sanctuary Environment Card ── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, marginBottom: 14 }]}>
            ROOM ENVIRONMENT
          </Text>

          <View style={styles.envGrid}>
            <View style={[styles.envItem, { backgroundColor: colors.surfaceAlt }]}>
              <HugeiconsIcon icon={ThermometerIcon} size={20} color="#EF4444" />
              <View style={styles.envTextCol}>
                <Text style={[styles.envItemVal, { color: colors.textPrimary }]}>68°F</Text>
                <Text style={[styles.envItemLabel, { color: colors.textSecondary }]}>Optimal Sleep Temp</Text>
              </View>
            </View>

            <View style={[styles.envItem, { backgroundColor: colors.surfaceAlt }]}>
              <HugeiconsIcon icon={DropletIcon} size={20} color="#3B82F6" />
              <View style={styles.envTextCol}>
                <Text style={[styles.envItemVal, { color: colors.textPrimary }]}>45%</Text>
                <Text style={[styles.envItemLabel, { color: colors.textSecondary }]}>Ideal Humidity</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Action Button: Edit Sleep Schedule ── */}
        <TouchableOpacity
          style={styles.scheduleCtaBtn}
          onPress={() => navigation.navigate('SleepSchedule')}
          activeOpacity={0.88}
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} size={18} color="#FFFFFF" />
          <Text style={styles.scheduleCtaText}>Configure Sleep Target & Smart Alarm</Text>
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
    letterSpacing: 0.6,
    color: '#818CF8',
  },
  heroMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  heroSubText: {
    fontSize: 12,
    fontWeight: '500',
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeChipArrow: {
    fontSize: 12,
    fontWeight: '700',
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
    gap: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  cardHeaderBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Sleep Stage Gauge
  stageGaugeTrack: {
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  stageGaugeSegment: {
    height: '100%',
  },
  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stageItem: {
    width: (width - 40 - 36 - 10) / 2,
    borderRadius: 16,
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
    fontWeight: '700',
  },
  stageDuration: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  stagePct: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // Chart
  chartBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: 10,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  chartBarLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  chartBar: {
    width: 18,
    borderRadius: 9,
  },
  chartDayText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Biometrics
  biometricsRow: {
    flexDirection: 'row',
    gap: 10,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bioVal: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  bioUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
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

  // Checklist
  checklistBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  checklistBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  checklistWrapper: {
    gap: 8,
    marginTop: 6,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabelText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  checkLabelChecked: {
    textDecorationLine: 'none',
  },

  // Room Environment
  envGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  envItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
  },
  envTextCol: {
    flex: 1,
  },
  envItemVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  envItemLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },

  // CTA
  scheduleCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default SleepDetailsScreen;
