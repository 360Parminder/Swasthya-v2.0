import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { PlusSignCircleIcon, Coffee01Icon, Coffee02Icon } from '@hugeicons/core-free-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native'
import { ArrowLeft01Icon, DropletIcon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'

const WaterOption = ({ title, amount, iconName, COLORS, styles }) => (
  <View style={styles.waterOptionCard}>
    <View style={styles.waterOptionLeft}>
      <View style={styles.waterOptionIconBox}>
        <HugeiconsIcon icon={iconName} size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.waterOptionTitle}>{title}</Text>
        <Text style={styles.waterOptionAmount}>{amount}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.waterOptionButton}>
      <HugeiconsIcon icon={PlusSignCircleIcon} size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  </View>
);

// Helper component for Timeline Log
const LogItem = ({ title, time, amount, isLast }) => (
  <View style={styles.logItemContainer}>
    {/* Timeline Track */}
    <View style={styles.timelineTrack}>
      <View style={styles.timelineDot} />
      {!isLast && <View style={styles.timelineLine} />}
    </View>

    {/* Content */}
    <View style={styles.logItemContent}>
      <View>
        <Text style={styles.logItemTitle}>{title}</Text>
        <Text style={styles.logItemTime}>{time}</Text>
      </View>
      <Text style={styles.logItemAmount}>{amount}</Text>
    </View>
  </View>
);

const HydrationScreen = () => {
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  // Settings for the progress arc
  const radius = 90;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Let's create a 270 degree arc (75% of circle)
  const arcLength = 0.75 * circumference;
  const gapLength = 0.25 * circumference;
  // Out of that 270 degree arc, we fill 75%
  const progressRatio = 0.75;
  const progressLength = arcLength * progressRatio;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hydration</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HydrationSettings')} style={styles.headerButton}>
          <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Top Progress Chart */}
        <View style={styles.progressSection}>
          <View style={styles.svgContainer}>
            <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
              <G rotation="135" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
                {/* Background Arc */}
                <Circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength} ${gapLength}`}
                />
                {/* Progress Arc */}
                <Circle
                  cx={radius + strokeWidth}
                  cy={radius + strokeWidth}
                  r={radius}
                  stroke={COLORS.primary}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressLength} ${circumference}`}
                />
              </G>
            </Svg>

            {/* Inner Content */}
            <View style={styles.innerProgressContent}>
              <View style={styles.innerValueContainer}>
                <Text style={styles.innerMainValue}>1.5</Text>
                <Text style={styles.innerUnitText}>L</Text>
              </View>
              <Text style={styles.innerGoalText}>Goal: 2.0L</Text>
              <View style={styles.innerPill}>
                <Text style={styles.innerPillText}>75% COMPLETE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Log Water Intake */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Log Water Intake</Text>
          <WaterOption title="Small Glass" amount="200ml" iconName={DropletIcon} COLORS={COLORS} styles={styles} />
          <WaterOption title="Medium Mug" amount="350ml" iconName={Coffee01Icon} COLORS={COLORS} styles={styles} />
          <WaterOption title="Large Bottle" amount="500ml" iconName={Coffee02Icon} COLORS={COLORS} styles={styles} />
        </View>

        {/* Weekly Trends */}
        <TouchableOpacity onPress={() => navigation.navigate('HydrationHistory')} style={styles.sectionContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Weekly Trends</Text>
            <Text style={styles.avgText}>AVG 1.8L</Text>
          </View>

          <View style={styles.chartCard}>
            {/* Dummy chart bars space */}
            <View style={{ height: 100 }} />
            {/* X-axis labels */}
            <View style={styles.chartLabels}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Text key={idx} style={[styles.chartDay, day === 'W' && styles.chartDayActive]}>
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </TouchableOpacity>

        {/* Today's Logs */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Logs</Text>
          <LogItem title="Large Bottle" time="10:45 AM" amount="+500ml" />
          <LogItem title="Medium Mug" time="09:15 AM" amount="+350ml" />
          <LogItem title="Small Glass" time="08:30 AM" amount="+200ml" />
          <LogItem title="Large Bottle" time="06:45 AM" amount="+500ml" isLast />
        </View>

        {/* Pro Tip */}
        <View style={styles.proTipCard}>
          <HugeiconsIcon icon={DropletIcon} size={24} color={COLORS.primary} strokeWidth={2.5} />
          <Text style={styles.proTipTitle}>Pro Tip</Text>
          <Text style={styles.proTipText}>
            Drinking water first thing in the morning boosts your metabolism and mental clarity. You're doing great!
          </Text>
          <HugeiconsIcon icon={DropletIcon} size={100} color="#BAE6FD" style={styles.proTipBgWater} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // Almost white/light gray matching the design
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Top Progress Section */
  progressSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 200,
    width: 240,
    height: 240,
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  innerProgressContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  innerMainValue: {
    fontSize: 54,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  innerUnitText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 2,
  },
  innerGoalText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: -2,
    marginBottom: 8,
  },
  innerPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  innerPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  /* Sections */
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avgText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  /* Water Option Cards */
  waterOptionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  waterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterOptionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  waterOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  waterOptionAmount: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  waterOptionButton: {
    padding: 4,
  },

  /* Chart Card */
  chartCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartDay: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chartDayActive: {
    color: COLORS.primary,
  },

  /* Timeline Log Item */
  logItemContainer: {
    flexDirection: 'row',
  },
  timelineTrack: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: 6,
    marginBottom: -6, // to connect seamlessly
  },
  logItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  logItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  logItemTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  logItemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },

  /* Pro Tip Card */
  proTipCard: {
    backgroundColor: COLORS.primarySoft, // Light blue background
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bulbIcon: {
    marginBottom: 12,
  },
  proTipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  proTipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
    zIndex: 2,
    paddingRight: 10,
  },
  proTipBgWater: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    opacity: 0.2,
    zIndex: 1,
  },
});

export default HydrationScreen;
