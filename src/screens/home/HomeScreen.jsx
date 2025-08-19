import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { getDayAndDate } from '../../utils/date';
import Swiper from 'react-native-deck-swiper';

const medications = [
  {
    name: 'Paracetamol',
    time: '8:30 AM',
    dose: '500mg',
    fillsLeft: 2,
    image: require('../../../assets/images/capsule.png'),
  },
  {
    name: 'Amoxicillin',
    time: '12:00 PM',
    dose: '250mg',
    fillsLeft: 5,
    image: require('../../../assets/images/capsule.png'),
  },
  {
    name: 'Metformin',
    time: '8:00 PM',
    dose: '850mg',
    fillsLeft: 3,
    image: require('../../../assets/images/capsule.png'),
  },
];

const MedicationCard = ({ med }) => (
  <View style={styles.medCard}>
    <Image source={med.image} style={styles.medImage} />
    <Text style={styles.medName}>{med.name}</Text>
    <Text style={styles.medDetail}>Time: {med.time}</Text>
    <Text style={styles.medDetail}>Dose: {med.dose}</Text>
    <Text style={styles.medDetail}>Fills Left: {med.fillsLeft}</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: authState?.user?.avatar }}
              style={styles.profilePicture}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>Hello</Text>
              <Text style={styles.subtitle}>
                {authState?.user?.username || 'User'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Date Display */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>{getDayAndDate().day}, </Text>
        <Text style={styles.dateDate}>{getDayAndDate().date}</Text>
      </View>

      {/* Other Quick Links */}
      <View style={styles.cards}>
        {/* Medication Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Medication')}
          style={styles.card}>
          <Image
            source={require('../../../assets/images/medication.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>Medication</Text>
            <Text style={styles.cardSubheading}>View and track your medicines</Text>
          </View>
        </TouchableOpacity>

        {/* Connections Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Connections')}
          style={styles.card}>
          <Image
            source={require('../../../assets/images/connections.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>Connections</Text>
            <Text style={styles.cardSubheading}>Manage your care circle</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    width: '100%',
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik-Regular',
    color: COLORS.text,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: -10,
    fontSize: 18,
    fontFamily: 'Rubik-SemiBold',
    color: COLORS.textSecondary,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  dateContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dateDay: {
    color: COLORS.textSecondary,
    fontWeight: '500',
    fontSize: 18,
  },
  dateDate: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  medCard: {
    backgroundColor:'blue',
    // backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    // padding: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  medImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  medName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  medDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cards: {
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    marginBottom: 15,
  },
  cardImage: {
    width: 64,
    height: 64,
    marginRight: 18,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ebebebff',
  },
  cardSubheading: {
    fontSize: 15,
    color: '#ebebebff',
    marginTop: 4,
    fontWeight: '400',
  },
});

export default HomeScreen;
