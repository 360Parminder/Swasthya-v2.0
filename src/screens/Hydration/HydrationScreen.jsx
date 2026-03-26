import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useThemeColors } from '../../components/ui/colors';

// Helper component for Water Intake option
const WaterOption = ({ title, amount, iconName }) => (
  <View style={styles.waterOptionCard}>
    <View style={styles.waterOptionLeft}>
      <View style={styles.waterOptionIconBox}>
        <Icon name={iconName} size={20} color="#0F766E" />
      </View>
      <View>
        <Text style={styles.waterOptionTitle}>{title}</Text>
        <Text style={styles.waterOptionAmount}>{amount}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.waterOptionButton}>
      <Icon name="add-circle" size={24} color="#6B7280" />
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
  const colors = useThemeColors();

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
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hydration</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="ellipsis-vertical" size={24} color="#1F2937" />
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
                  stroke="#0F766E"
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
          <WaterOption title="Small Glass" amount="200ml" iconName="water-outline" />
          <WaterOption title="Medium Mug" amount="350ml" iconName="cafe-outline" />
          <WaterOption title="Large Bottle" amount="500ml" iconName="pint-outline" />
        </View>

        {/* Weekly Trends */}
        <View style={styles.sectionContainer}>
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
        </View>

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
          <Icon name="bulb" size={24} color="#475569" style={styles.bulbIcon} />
          <Text style={styles.proTipTitle}>Pro Tip</Text>
          <Text style={styles.proTipText}>
            Drinking water first thing in the morning boosts your metabolism and mental clarity. You're doing great!
          </Text>
          <Icon name="water" size={100} color="#BAE6FD" style={styles.proTipBgWater} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Almost white/light gray matching the design
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
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
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
    color: '#0F766E',
    letterSpacing: -1,
  },
  innerUnitText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F766E',
    marginLeft: 2,
  },
  innerGoalText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    marginTop: -2,
    marginBottom: 8,
  },
  innerPill: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  innerPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    letterSpacing: 0.5,
  },

  /* Sections */
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
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
    color: '#0F766E',
    letterSpacing: 0.5,
  },

  /* Water Option Cards */
  waterOptionCard: {
    backgroundColor: '#FFFFFF',
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
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  waterOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  waterOptionAmount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
  waterOptionButton: {
    padding: 4,
  },

  /* Chart Card */
  chartCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#94A3B8',
  },
  chartDayActive: {
    color: '#0F766E',
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
    backgroundColor: '#0F766E',
    marginTop: 6,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  logItemTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  logItemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 2,
  },

  /* Pro Tip Card */
  proTipCard: {
    backgroundColor: '#E0F2FE', // Light blue background
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
    color: '#1E293B',
    marginBottom: 8,
  },
  proTipText: {
    fontSize: 14,
    color: '#475569',
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
