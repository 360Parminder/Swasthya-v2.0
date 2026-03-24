import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { getDayAndDate } from '../../utils/date';
import MedicationScheduleCard from '../../components/home/MedicationScheduleCard';
import { dashboardApi } from '../../api/dashboard';

const HeartRateCard = () => (
  <View style={[cardStyles.card, cardStyles.heartCard]}>
    <Text style={cardStyles.heartTitle}>HEART RATE</Text>
    <View style={cardStyles.heartValueRow}>
      <Text style={cardStyles.heartValue}>72</Text>
      <Text style={cardStyles.heartUnit}> bpm</Text>
    </View>
    <View style={cardStyles.heartFooterRow}>
      <Icon name="pulse" size={14} color="#A7F3D0" />
      <Text style={cardStyles.heartFooterText}>Resting stable</Text>
    </View>
  </View>
);

const SleepQualityCard = () => (
  <View style={[cardStyles.card, cardStyles.whiteCard]}>
    <Text style={cardStyles.cardTitle}>SLEEP QUALITY</Text>
    <Text style={cardStyles.sleepValue}>7h 30m</Text>
    <Text style={cardStyles.sleepSubtitle}>Deep Sleep: 2h 15m</Text>
    <View style={cardStyles.sleepBars}>
      {[14, 20, 38, 24, 20, 18].map((h, i) => (
        <View key={i} style={[cardStyles.sleepBar, { height: h, backgroundColor: i === 2 ? '#546A7B' : '#B8C8D0' }]} />
      ))}
    </View>
  </View>
);

const HydrationCard = () => (
  <View style={[cardStyles.card, cardStyles.whiteCard]}>
    <View style={cardStyles.rowBetween}>
      <Text style={cardStyles.cardTitle}>HYDRATION</Text>
      <Icon name="water" size={18} color="#0D47A1" />
    </View>
    <View style={cardStyles.hydrationValueRow}>
      <Text style={cardStyles.hydrationValue}>1.5 </Text>
      <Text style={cardStyles.hydrationUnit}>/ 2L</Text>
    </View>
    <View style={cardStyles.hydrationProgressBg}>
      <View style={cardStyles.hydrationProgressFill} />
    </View>
    <Text style={cardStyles.hydrationGoal}>75% OF GOAL</Text>
  </View>
);

const CareNetworkCard = () => (
  <View style={[cardStyles.card, cardStyles.careCard]}>
    <Text style={cardStyles.careTitle}>CARE NETWORK</Text>
    <View style={cardStyles.avatarRow}>
      <Image source={{ uri: 'https://i.pravatar.cc/100?img=5' }} style={[cardStyles.careAvatar, { zIndex: 3 }]} />
      <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} style={[cardStyles.careAvatar, { zIndex: 2, marginLeft: -12 }]} />
      <View style={[cardStyles.careMoreAvatar, { zIndex: 1, marginLeft: -12 }]}>
        <Text style={cardStyles.careMoreText}>+3</Text>
      </View>
    </View>
    <Text style={cardStyles.careName}>Dr. Sarah Miller</Text>
    <Text style={cardStyles.careRole}>Primary Physician - Online</Text>
  </View>
);

const BloodPressureCard = () => (
  <View style={[cardStyles.card, cardStyles.whiteCard, { marginBottom: 30 }]}>
    <Text style={[cardStyles.cardTitle, { textAlign: 'center', marginBottom: 6 }]}>BLOOD PRESSURE</Text>
    <Text style={[cardStyles.bpValue, { textAlign: 'center' }]}>120/80 <Text style={cardStyles.bpUnit}>mmHg</Text></Text>

    <View style={cardStyles.rowBetweenBP}>
      <Text style={cardStyles.bpFooterText}>Normal Range</Text>
      <Text style={cardStyles.bpFooterBold}>Optimal</Text>
    </View>
    <View style={cardStyles.bpSliderBg}>
      <View style={cardStyles.bpSliderThumb} />
    </View>
  </View>
);

const HomeScreen = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [medications, setMedications] = useState([{}, {}]); // Mock layout objects
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardApi.getDashboardData();
      const meds = response?.data?.data?.medication;
      setMedications(meds && meds.length > 0 ? meds : []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  console.log(medications);


  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
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
            <Icon name="notifications-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Date Display */}
        <View style={styles.dateContainer}>
          <Text style={styles.fullDateText}>{getDayAndDate().day}, {getDayAndDate().date}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
      >
        <MedicationScheduleCard medications={medications} />

        <HeartRateCard />

        <SleepQualityCard />

        <HydrationCard />

        <CareNetworkCard />

        <BloodPressureCard />
      </ScrollView>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F7F9FA', // Very light gray from design
  },
  headerContainer: {
    width: '100%',
    // marginBottom: 10,
    backgroundColor: "#252525",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    backgroundColor: '#000000',
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#252525',
  },
  fullDateText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    paddingTop: 10,
    gap: 16,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  heartCard: {
    backgroundColor: '#115E59', // Dark Teal
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
  },
  careCard: {
    backgroundColor: '#0369A1', // Dark blue
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  /* Heart Rate */
  heartTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heartValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  heartValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 52,
  },
  heartUnit: {
    fontSize: 16,
    color: '#D1FAE5',
    marginLeft: 4,
    fontWeight: '500',
  },
  heartFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartFooterText: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },

  /* Sleep Quality */
  sleepValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sleepSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 20,
  },
  sleepBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 45,
  },
  sleepBar: {
    flex: 1,
    borderRadius: 4,
  },

  /* Hydration */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hydrationValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  hydrationValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  hydrationUnit: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  hydrationProgressBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  hydrationProgressFill: {
    height: '100%',
    width: '75%',
    backgroundColor: '#0F766E',
    borderRadius: 4,
  },
  hydrationGoal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
    textAlign: 'center',
    letterSpacing: 1,
  },

  /* Care Network */
  careTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BAE6FD',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  careAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0369A1',
  },
  careMoreAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#0369A1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  careMoreText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 13,
  },
  careName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  careRole: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '400',
  },

  /* Blood Pressure */
  bpValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 20,
  },
  bpUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  rowBetweenBP: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bpFooterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bpFooterBold: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '700',
  },
  bpSliderBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    justifyContent: 'center',
  },
  bpSliderThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0F766E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    left: '80%',
  }
});

export default HomeScreen;
