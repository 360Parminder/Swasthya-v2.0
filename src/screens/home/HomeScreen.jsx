import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDayAndDate } from '../../utils/date';
import { medicationApi } from '../../api/medicationApi';

// ─── Medication Type Icons ──────────────────────────────────────────
const formImages = {
  tablet: require('../../../assets/images/tablet.png'),
  capsule: require('../../../assets/images/capsule.png'),
  liquid: require('../../../assets/images/liquid.png'),
  injection: require('../../../assets/images/injection.png'),
  inhaler: require('../../../assets/images/inhaler.png'),
  topical: require('../../../assets/images/topical.png'),
  drops: require('../../../assets/images/drops.png'),
  suppository: require('../../../assets/images/suppository.png'),
  patch: require('../../../assets/images/patch.png'),
};

// ─── Mini Chart Components ───────────────────────────────────────────

const WeekDays = ({ color }) => (
  <View style={miniStyles.weekRow}>
    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
      <Text key={i} style={[miniStyles.weekLabel, { color }]}>
        {d}
      </Text>
    ))}
  </View>
);

const BarChart = ({ barColor, heights, subTextColor }) => (
  <View>
    <View style={miniStyles.barRow}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            miniStyles.bar,
            { height: h, backgroundColor: barColor, opacity: 0.4 + (h / 32) * 0.6 },
          ]}
        />
      ))}
    </View>
    <WeekDays color={subTextColor} />
  </View>
);

const DotGrid = ({ dotColor, filled, subTextColor }) => (
  <View>
    <View style={miniStyles.dotRow}>
      {filled.map((f, i) => (
        <View
          key={i}
          style={[
            miniStyles.dot,
            {
              backgroundColor: f ? dotColor : '#D1D5DB',
              opacity: f ? 1 : 0.4,
            },
          ]}
        />
      ))}
    </View>
    <WeekDays color={subTextColor} />
  </View>
);

const TodayDots = ({ dotColor, filled }) => (
  <View style={miniStyles.dotRow}>
    {filled.map((f, i) => (
      <View
        key={i}
        style={[
          miniStyles.dot,
          {
            backgroundColor: f ? dotColor : '#D1D5DB',
            opacity: f ? 1 : 0.4,
          },
        ]}
      />
    ))}
  </View>
);

const CircleRow = ({ circleColor, checks, subTextColor }) => (
  <View>
    <View style={miniStyles.circleCheckRow}>
      {checks.map((c, i) => (
        <View key={i} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: c ? '#4CAF50' : '#EF4444', marginBottom: 2 }}>
            {c ? '✓' : '✗'}
          </Text>
          <View
            style={[
              miniStyles.circle,
              {
                borderColor: circleColor,
                backgroundColor: c ? circleColor + '22' : 'transparent',
              },
            ]}
          />
        </View>
      ))}
    </View>
    <WeekDays color={subTextColor} />
  </View>
);

const MiniLineChart = ({ lineColor, subTextColor }) => {
  const points = [18, 14, 16, 10, 12, 8, 14];
  return (
    <View>
      <View style={miniStyles.lineChartContainer}>
        {points.map((p, i) => (
          <View key={i} style={{ alignItems: 'center', justifyContent: 'flex-end', height: 28 }}>
            <View
              style={{
                width: 4,
                height: p,
                backgroundColor: lineColor,
                borderRadius: 2,
                opacity: 0.15,
              }}
            />
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: lineColor,
                marginTop: -2,
              }}
            />
          </View>
        ))}
      </View>
      <WeekDays color={subTextColor} />
    </View>
  );
};

const WaterBars = ({ barColor, levels, subTextColor }) => (
  <View>
    <View style={miniStyles.barRow}>
      {levels.map((h, i) => (
        <View key={i} style={{ alignItems: 'center' }}>
          <View
            style={[
              miniStyles.waterBar,
              { height: h, backgroundColor: barColor, opacity: 0.5 + (h / 28) * 0.5 },
            ]}
          />
        </View>
      ))}
    </View>
    <WeekDays color={subTextColor} />
  </View>
);

// ─── Health Card Data ────────────────────────────────────────────────

const healthCards = [
  {
    key: 'weight',
    icon: '⚖️',
    title: 'Weight',
    value: '70.00',
    unit: 'kg',
    subtitle: 'Stable weight',
    chartType: 'bar',
    chartColor: '#6B7280',
    chartData: [18, 22, 16, 24, 20, 12, 26],
  },
  {
    key: 'sleep',
    icon: '💤',
    title: 'Sleep',
    value: '3.57',
    unit: 'hr',
    subtitle: 'Insomniac',
    chartType: 'circles',
    chartColor: '#F97316',
    chartData: [true, false, true, false, false, false, true],
  },
  {
    key: 'bp',
    icon: '💧',
    title: 'Blood Pressure',
    value: '128/80',
    unit: 'mmHg',
    subtitle: 'Stable Range',
    chartType: 'bar',
    chartColor: '#8B5CF6',
    chartData: [14, 20, 10, 24, 18, 12, 22],
  },
  {
    key: 'nutrition',
    icon: '🥗',
    title: 'Nutrition',
    value: '998',
    unit: 'kcal',
    subtitle: 'On Track',
    chartType: 'dots',
    chartColor: '#65A30D',
    chartData: [true, true, true, true, false, false, false],
  },
  {
    key: 'heart',
    icon: '❤️',
    title: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    subtitle: 'Resting Rate',
    chartType: 'line',
    chartColor: '#EF4444',
    chartData: null,
  },
  {
    key: 'hydration',
    icon: '🧊',
    title: 'Hydration',
    value: '1,285',
    unit: 'ml',
    subtitle: 'On Track',
    chartType: 'water',
    chartColor: '#3B82F6',
    chartData: [12, 18, 22, 16, 24, 20, 26],
  },
];

// ─── Chart Renderer ──────────────────────────────────────────────────

const renderChart = (card, subTextColor) => {
  switch (card.chartType) {
    case 'bar':
      return <BarChart barColor={card.chartColor} heights={card.chartData} subTextColor={subTextColor} />;
    case 'dots':
      return <DotGrid dotColor={card.chartColor} filled={card.chartData} subTextColor={subTextColor} />;
    case 'todayDots':
      return <TodayDots dotColor={card.chartColor} filled={card.chartData} />;
    case 'circles':
      return <CircleRow circleColor={card.chartColor} checks={card.chartData} subTextColor={subTextColor} />;
    case 'line':
      return <MiniLineChart lineColor={card.chartColor} subTextColor={subTextColor} />;
    case 'water':
      return <WaterBars barColor={card.chartColor} levels={card.chartData} subTextColor={subTextColor} />;
    default:
      return null;
  }
};

// ─── Health Card Component ───────────────────────────────────────────

const HealthCard = ({ card, styles, COLORS, navigate }) => {
  const navigation = useNavigation();
  const isImageIcon = typeof card.icon === 'number' || (typeof card.icon === 'object' && card.icon?.uri);
  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigate)} style={styles.healthCard} activeOpacity={0.7}>
      <View style={styles.healthCardHeader}>
        <View style={styles.healthCardTitleRow}>
          {isImageIcon ? (
            <Image source={card.icon} style={styles.healthCardImageIcon} resizeMode="contain" />
          ) : (
            <Text style={styles.healthCardIcon}>{card.icon}</Text>
          )}
          <Text style={styles.healthCardTitle}>{card.title}</Text>
        </View>
        <View style={styles.todayRow}>
          <Text style={styles.todayText}>Today</Text>
          <Text style={styles.todayChevron}> ›</Text>
        </View>
      </View>
      <View style={styles.healthCardBody}>
        <View style={styles.healthCardValueSection}>
          <View style={styles.healthCardValueRow}>
            <Text style={styles.healthCardValue}>{card.value}</Text>
            <Text style={styles.healthCardUnit}> {card.unit}</Text>
          </View>
          <Text style={styles.healthCardSubtitle}>{card.subtitle}</Text>
        </View>
        <View style={styles.healthCardChartSection}>
          {renderChart(card, COLORS.healthCardSubtext)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main HomeScreen ─────────────────────────────────────────────────

const HomeScreen = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await medicationApi.getAllMedications();
      setMedications(response?.data?.medications ?? []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const medicationCard = useMemo(() => {
    const now = new Date();
    let nextMed = null;
    let minDiff = Infinity;

    medications.forEach((med) => {
      med.record?.forEach((rec) => {
        rec.times?.forEach((t) => {
          const recTime = new Date(t.reception_time);
          const todayTime = new Date(now);
          todayTime.setHours(recTime.getUTCHours(), recTime.getUTCMinutes(), 0, 0);

          const diff = todayTime.getTime() - now.getTime();
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextMed = {
              name: med.medicine_name || rec.medicine_name,
              strength: rec.strength,
              unit: rec.unit,
              form: (rec.forms || med.forms || 'tablet').toLowerCase(),
              time: todayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            };
          }
        });
      });
    });

    const slots = [false, false, false, false];
    const hours = now.getHours();
    if (hours >= 9) slots[0] = true;
    if (hours >= 13) slots[1] = true;
    if (hours >= 19) slots[2] = true;
    if (hours >= 22) slots[3] = true;

    return {
      key: 'medication',
      icon: nextMed ? (formImages[nextMed.form] || formImages.tablet) : '💊',
      title: 'Medication',
      value: nextMed ? nextMed.name : 'All done',
      unit: nextMed ? `${nextMed.strength} ${nextMed.unit}` : '',
      subtitle: nextMed ? `Next: ${nextMed.time}` : 'No more doses today',
      chartType: 'todayDots',
      chartColor: '#10B981',
      chartData: slots,
      navigate: 'Medication'
    };
  }, [medications]);

  const allHealthCards = useMemo(() => [medicationCard, ...healthCards], [medicationCard]);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={{ backgroundColor: '#272727ff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        <View style={styles.headerBar}>
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: authState?.user?.avatar || 'https://via.placeholder.com/150' }}
                style={styles.profilePicture}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>Hello</Text>
                <Text style={styles.userName}>
                  {authState?.user?.username || 'Parminder Singh'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Icon name="notifications-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Display */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>{getDayAndDate().day}, </Text>
          <Text style={styles.dateDate}>{getDayAndDate().date}</Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Quick Links — Medication & Care Circle */}
        <View style={styles.quickLinksContainer}>
          {/* Medication Card */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Medication')}
            style={styles.quickLinkCard}
            activeOpacity={0.7}>
            <View style={styles.quickLinkLeft}>
              <View style={[styles.quickLinkIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="medkit" size={22} color="#2E7D32" />
              </View>
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkTitle}>Medicines</Text>
                <Text style={styles.quickLinkSubtitle}>Manage your medications</Text>
              </View>
            </View>
            <View style={styles.quickLinkRight}>
              <Text style={styles.quickLinkChevron}>›</Text>
            </View>
          </TouchableOpacity> */}

          {/* Connections Card */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Connections')}
            style={styles.quickLinkCard}
            activeOpacity={0.7}>
            <View style={styles.quickLinkLeft}>
              <View style={[styles.quickLinkIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="people" size={22} color="#E65100" />
              </View>
              <View style={styles.quickLinkTextContainer}>
                <Text style={styles.quickLinkTitle}>Care Circle</Text>
                <Text style={styles.quickLinkSubtitle}>Your trusted connections</Text>
              </View>
            </View>
            <View style={styles.quickLinkRight}>
              <Text style={styles.quickLinkChevron}>›</Text>
            </View>
          </TouchableOpacity> */}
        </View>

        {/* Health Metric Cards */}
        <View style={styles.healthCardsGrid}>
          {allHealthCards.map((card) => (
            <HealthCard key={card.key} card={card} styles={styles} COLORS={COLORS} navigate={card.navigate} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Mini Chart Styles ───────────────────────────────────────────────

const miniStyles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  weekLabel: {
    fontSize: 9,
    fontWeight: '500',
    width: 14,
    textAlign: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 28,
  },
  bar: {
    width: 8,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  waterBar: {
    width: 10,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 1,
  },
  circleCheckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 28,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  lineChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 28,
  },
});

// ─── Main Styles ─────────────────────────────────────────────────────

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    backgroundColor: '#000',
    width: '100%',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 10,
    elevation: 5,
    shadowColor: '#000000ff',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: '#272727ff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  dateDay: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  dateDate: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // Quick Link cards (Medication & Care Circle)
  quickLinksContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 12,
  },
  quickLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  quickLinkIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  quickLinkTextContainer: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.healthCardText,
  },
  quickLinkSubtitle: {
    fontSize: 13,
    color: COLORS.healthCardSubtext,
    marginTop: 2,
    fontWeight: '400',
  },
  quickLinkRight: {
    paddingLeft: 8,
  },
  quickLinkChevron: {
    fontSize: 22,
    color: COLORS.healthCardSubtext,
    fontWeight: '600',
  },
  // Health metric cards grid
  healthCardsGrid: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  healthCard: {
    width: '100%',
    backgroundColor: COLORS.healthCardBackground,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthCardIcon: {
    fontSize: 14,
  },
  healthCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.healthCardText,
  },
  healthCardImageIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayText: {
    fontSize: 12,
    color: COLORS.healthCardSubtext,
    fontWeight: '500',
  },
  todayChevron: {
    fontSize: 14,
    color: COLORS.healthCardSubtext,
    fontWeight: '600',
  },
  healthCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  healthCardValueSection: {
    flex: 1,
  },
  healthCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  healthCardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.healthCardText,
  },
  healthCardUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.healthCardSubtext,
  },
  healthCardSubtitle: {
    fontSize: 12,
    color: COLORS.healthCardSubtext,
    marginTop: 2,
    fontWeight: '400',
  },
  healthCardChartSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default HomeScreen;
