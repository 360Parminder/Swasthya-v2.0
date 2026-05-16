import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Notification01Icon, Moon02Icon } from '@hugeicons/core-free-icons';

const { width } = Dimensions.get('window');

// Checklist Item
const ChecklistItem = ({ label, checked, badge }) => (
  <View style={styles.checkItem}>
    <View style={[styles.checkCircle, checked && styles.checkCircleActive]}>
      {checked && <Icon name="checkmark" size={14} color="#FFFFFF" />}
    </View>
    <Text style={styles.checkLabel}>{label}</Text>
    {badge && (
      <View style={styles.activeBadge}>
        <Text style={styles.activeBadgeText}>{badge}</Text>
      </View>
    )}
  </View>
);

// Environment Row
const EnvRow = ({ iconName, iconColor, label, value, badge, badgeColor }) => (
  <View style={styles.envRow}>
    <Icon name={iconName} size={22} color={iconColor} />
    <View style={{ marginLeft: 14, flex: 1 }}>
      <Text style={styles.envLabel}>{label}</Text>
      <Text style={styles.envValue}>{value}</Text>
    </View>
    {badge && (
      <Text style={[styles.envBadge, { color: badgeColor || '#0F766E' }]}>{badge}</Text>
    )}
  </View>
);

// Sleep Efficiency Day Card
const EfficiencyCard = ({ day, barHeights, isHighlight }) => (
  <View style={styles.effCard}>
    <View style={styles.effBarContainer}>
      {barHeights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.effBar,
            {
              height: h,
              backgroundColor: isHighlight ? '#0F766E' : '#CBD5E1',
            },
          ]}
        />
      ))}
    </View>
    <Text style={styles.effDay}>{day}</Text>
  </View>
);

const SleepDetailsScreen = () => {
  const navigation = useNavigation();
  const colors = useThemeColors();

  // Circular goal indicator
  const radius = 65;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.8; // 8h/8h = 100%
  const progressLength = circumference * progress;

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Routine</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('SleepSchedule')} style={styles.headerButton}>
            <HugeiconsIcon icon={Moon02Icon} size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F8FAFC' }}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Hero Card */}
        <ImageBackground
          source={require('../../assets/bedroom_sleep_bg.png')}
          style={styles.heroCard}
          imageStyle={styles.heroCardImage}
        >
          <LinearGradient
            colors={['rgba(17,94,89,0.88)', 'rgba(17,94,89,0.92)', 'rgba(17, 94, 89, 0.45)']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Tonight's Routine</Text>
            <Text style={styles.heroSubtitle}>Optimal rest begins with consistency.</Text>

            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>BEDTIME</Text>
                <Text style={styles.timeValue}>10:30{'\n'}PM</Text>
              </View>
              <View style={styles.timeDivider} />
              <View style={styles.timeBlock}>
                <Text style={styles.timeLabel}>WAKE UP</Text>
                <Text style={styles.timeValue}>06:30{'\n'}AM</Text>
              </View>
            </View>

            {/* Circular Goal */}
            <View style={styles.goalCircleContainer}>
              <Svg width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
                <G rotation="-90" origin={`${radius + strokeWidth}, ${radius + strokeWidth}`}>
                  <Circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                    stroke="#5EEAD4"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progressLength} ${circumference}`}
                  />
                </G>
              </Svg>
              <View style={styles.goalInner}>
                <Text style={styles.goalNumber}>8h</Text>
                <Text style={styles.goalLabel}>Goal</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Bedtime Checklist */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Bedtime Checklist</Text>
              <Text style={styles.sectionSubtitle}>4 of 5 tasks completed</Text>
            </View>
            <TouchableOpacity>
              <Icon name="options-outline" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ChecklistItem label="Digital detox (No screens)" checked />
          <ChecklistItem label="Dim ambient lighting" checked />
          <ChecklistItem label="10-minute meditation" checked />
          <ChecklistItem label="Room temperature check" badge="Active" />
        </View>

        {/* Room Environment */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Room Environment</Text>
          <View style={{ marginTop: 16 }}>
            <EnvRow
              iconName="thermometer-outline"
              iconColor="#EF4444"
              label="Temperature"
              value="68°F"
              badge="OPTIMAL"
              badgeColor="#0F766E"
            />
            <EnvRow
              iconName="water-outline"
              iconColor="#3B82F6"
              label="Humidity"
              value="45%"
              badge="IDEAL"
              badgeColor="#3B82F6"
            />
            <EnvRow
              iconName="leaf-outline"
              iconColor="#10B981"
              label="Air Quality"
              value="Fresh"
            />
          </View>
        </View>

        {/* Consistency Streak */}
        <View style={styles.streakCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakLabel}>Consistency Streak</Text>
            <Text style={styles.streakValue}>12 <Text style={styles.streakUnit}>days</Text></Text>
            <View style={styles.streakDotsRow}>
              <View style={[styles.streakDot, styles.streakDotFilled]} />
              <View style={[styles.streakDot, styles.streakDotFilled]} />
              <View style={[styles.streakDot, styles.streakDotFilled]} />
              <View style={styles.streakDot} />
              <View style={styles.streakDot} />
            </View>
            <Text style={styles.streakMsg}>Keep it up!</Text>
          </View>
          <Icon name="moon" size={50} color="rgba(255,255,255,0.12)" />
        </View>


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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },

  /* Hero Card */
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroCardImage: {
    borderRadius: 20,
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#99F6E4',
    marginBottom: 24,
    fontWeight: '400',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  timeBlock: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#99F6E4',
    letterSpacing: 1,
    marginBottom: 6,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  timeDivider: {
    width: 16,
  },
  goalCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  goalInner: {
    position: 'absolute',
    alignItems: 'center',
  },
  goalNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goalLabel: {
    fontSize: 11,
    color: '#5EEAD4',
    fontWeight: '600',
    marginTop: -2,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },

  /* Checklist */
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkCircleActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },

  /* Environment */
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  envLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  envValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  envBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Streak Card */
  streakCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  streakLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 6,
  },
  streakValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 44,
  },
  streakUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#94A3B8',
  },
  streakDotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    marginBottom: 8,
  },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#334155',
  },
  streakDotFilled: {
    backgroundColor: '#FBBF24',
  },
  streakMsg: {
    fontSize: 12,
    color: '#5EEAD4',
    fontWeight: '600',
  },

  /* Sleep Efficiency */
  effSection: {
    marginBottom: 20,
  },
  effGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    justifyContent: 'flex-start',
  },
  effCard: {
    width: (width - 32 - 30) / 2, // 2 columns with gap
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  effBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 44,
    gap: 6,
    marginBottom: 10,
  },
  effBar: {
    width: 8,
    borderRadius: 4,
  },
  effDay: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
});

export default SleepDetailsScreen;
