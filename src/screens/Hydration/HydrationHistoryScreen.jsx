import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Calendar01Icon, ChartColumnIcon, DropletIcon, Coffee01Icon, Coffee02Icon, StarIcon, Tick02Icon, MoreVerticalIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../components/ui/colors';

// Mocks the entries
const EntryCard = ({ icon, title, time, amount, isGrayed = false, COLORS, styles }) => (
  <View style={styles.entryCard}>
    <View style={styles.entryLeft}>
      <View style={[styles.entryIconBox, isGrayed ? styles.entryIconBoxGray : styles.entryIconBoxBlue]}>
        <HugeiconsIcon icon={icon} size={20} color={isGrayed ? COLORS.textSecondary : COLORS.primary} />
      </View>
      <View>
        <Text style={styles.entryTitle}>{title}</Text>
        <Text style={styles.entryTime}>Logged at {time}</Text>
      </View>
    </View>
    <View style={styles.entryRight}>
      <Text style={styles.entryAmount}>{amount}</Text>
      <TouchableOpacity>
        <HugeiconsIcon icon={MoreVerticalIcon} size={16} color={COLORS.borderStrong} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  </View>
);

const SectionHeader = ({ title, progressText, progressFill, progressColor, isRed = false, hasCheck = false, COLORS, styles }) => (
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
    <View style={styles.sectionHeaderRight}>
      {hasCheck && <HugeiconsIcon icon={Tick02Icon} size={12} color={COLORS.primary} style={{ marginRight: 4 }} />}
      <Text style={[styles.sectionProgressText, isRed ? { color: COLORS.danger } : {}]}>{progressText}</Text>
      <View style={styles.miniProgressBarBg}>
        <View style={[styles.miniProgressBarFill, { width: progressFill, backgroundColor: progressColor }]} />
      </View>
    </View>
  </View>
);

const ChartBar = ({ day, heightPct, hasStar, COLORS, styles }) => (
  <View style={styles.chartCol}>
    <View style={styles.chartBarBg}>
      <View style={[styles.chartBarFill, { height: heightPct }]}>
        {hasStar && (
          <HugeiconsIcon icon={StarIcon} size={10} color={COLORS.buttonText} style={styles.chartStar} />
        )}
      </View>
    </View>
    <Text style={styles.chartDayText}>{day}</Text>
  </View>
);

const HydrationHistoryScreen = () => {
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hydration History</Text>
        <TouchableOpacity style={styles.headerButton}>
          <HugeiconsIcon icon={Calendar01Icon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Weekly Adherence */}
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <HugeiconsIcon icon={ChartColumnIcon} size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.weeklyTitle}>Weekly Adherence</Text>
            </View>
            <View style={styles.last7Pill}>
              <Text style={styles.last7Text}>Last 7 Days</Text>
            </View>
          </View>

          <View style={styles.chartRow}>
            <ChartBar day="MON" heightPct="100%" COLORS={COLORS} styles={styles} />
            <ChartBar day="TUE" heightPct="85%" COLORS={COLORS} styles={styles} />
            <ChartBar day="WED" heightPct="100%" hasStar COLORS={COLORS} styles={styles} />
            <ChartBar day="THU" heightPct="40%" COLORS={COLORS} styles={styles} />
            <ChartBar day="FRI" heightPct="100%" hasStar COLORS={COLORS} styles={styles} />
            <ChartBar day="SAT" heightPct="70%" COLORS={COLORS} styles={styles} />
            <ChartBar day="SUN" heightPct="30%" COLORS={COLORS} styles={styles} />
          </View>

          <View style={styles.weeklyDivider} />

          <View style={styles.weeklyStatsRow}>
            <View style={styles.weeklyStatCol}>
              <Text style={styles.weeklyStatLabel}>Weekly Avg</Text>
              <Text style={styles.weeklyStatValue}>1.8L</Text>
            </View>
            <View style={styles.weeklyStatDivider} />
            <View style={styles.weeklyStatCol}>
              <Text style={styles.weeklyStatLabel}>Goal Streak</Text>
              <Text style={styles.weeklyStatValue}>2 Days</Text>
            </View>
          </View>
        </View>

        {/* Today */}
        <View style={styles.dailySection}>
          <SectionHeader title="Today" progressText="1.5L / 2.0L" progressFill="75%" progressColor={COLORS.primary} COLORS={COLORS} styles={styles} />
          <EntryCard icon={Coffee02Icon} title="Large Bottle" time="14:32" amount="750ml" COLORS={COLORS} styles={styles} />
          <EntryCard icon={Coffee01Icon} title="Medium Mug" time="11:15" amount="350ml" COLORS={COLORS} styles={styles} />
          <EntryCard icon={DropletIcon} title="Small Glass" time="08:45" amount="400ml" COLORS={COLORS} styles={styles} />
        </View>

        {/* Yesterday */}
        <View style={styles.dailySection}>
          <SectionHeader title="Yesterday" progressText="1.1L / 2.0L" progressFill="55%" progressColor={COLORS.danger} isRed COLORS={COLORS} styles={styles} />
          <EntryCard icon={Coffee02Icon} title="Large Bottle" time="18:20" amount="750ml" isGrayed COLORS={COLORS} styles={styles} />
          <EntryCard icon={Coffee01Icon} title="Medium Mug" time="09:10" amount="350ml" isGrayed COLORS={COLORS} styles={styles} />
        </View>

        {/* Monday */}
        <View style={styles.dailySection}>
          <SectionHeader title="Monday, Oct 23" progressText="2.1L / 2.0L" progressFill="100%" progressColor={COLORS.primary} hasCheck COLORS={COLORS} styles={styles} />
          <TouchableOpacity style={styles.expandCard}>
            <HugeiconsIcon icon={Calendar01Icon} size={20} color={COLORS.textMuted} style={{ marginBottom: 4 }} />
            <Text style={styles.expandText}>Click to expand Monday's 5 entries</Text>
          </TouchableOpacity>
        </View>

        {/* Clinical Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Clinical Insight</Text>
          <Text style={styles.insightBody}>
            Based on your activity levels this week, increasing your water intake by 250ml before morning coffee may improve focus by up to 15%.
          </Text>
          <TouchableOpacity style={styles.insightPlusBtn}>
            <HugeiconsIcon icon={PlusSignIcon} size={24} color={COLORS.buttonText} />
          </TouchableOpacity>
          <HugeiconsIcon icon={DropletIcon} size={140} color="#000000" style={styles.insightWatermark} />
        </View>

      </ScrollView>
    </>

  );
};

const getStyles = (COLORS) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // padding for the bottom bar
    paddingTop: 16,
  },

  /* Weekly Card */
  weeklyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryHover,
  },
  last7Pill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  last7Text: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 20,
  },
  chartCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 34,
  },
  chartBarBg: {
    width: 32,
    height: 100,
    backgroundColor: COLORS.border,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: COLORS.primaryHover,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center', // Center the star if present
  },
  chartStar: {
    position: 'absolute',
    top: 10,
  },
  chartDayText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  weeklyDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  weeklyStatCol: {
    alignItems: 'center',
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  weeklyStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryHover,
  },
  weeklyStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  /* Daily Sections */
  dailySection: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  miniProgressBarBg: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  miniProgressBarFill: {
    height: 4,
    borderRadius: 2,
  },

  /* Entry Cards */
  entryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  entryIconBoxBlue: {
    backgroundColor: COLORS.primarySoft, // Light blue background for filled look
  },
  entryIconBoxGray: {
    backgroundColor: COLORS.border, // Gray background for logged historical items
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  entryTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryHover,
  },

  /* Expand Card (Monday) */
  expandCard: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  expandText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  /* Clinical Insight */
  insightCard: {
    backgroundColor: COLORS.primaryHover, // Very dark teal
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.buttonText,
    marginBottom: 10,
  },
  insightBody: {
    fontSize: 14,
    color: COLORS.primarySoft, // Very light teal
    lineHeight: 22,
    marginBottom: 16,
    zIndex: 2,
    paddingRight: 40,
  },
  insightPlusBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 2,
  },
  insightWatermark: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    opacity: 0.1,
    zIndex: 1,
  },

  /* Bottom Tab (Mock) */
  bottomTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 80,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: '#CCFBF1',
  },
  tabItemText: {
    fontSize: 10,
    marginTop: 4,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default HydrationHistoryScreen;
