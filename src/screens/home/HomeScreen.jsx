import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Image
              source={{ uri: authState?.user?.avatar }}
              style={styles.profilePicture}
            />
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={{  marginTop: 5,flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.subtitle}>
                {authState?.user?.username || 'User'}
              </Text>
              <Icon name="chevron-forward-outline" size={16} color={COLORS.textSecondary} style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="ellipsis-horizontal-circle" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Date Display */}
      {/* <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>{getDayAndDate().day}, </Text>
        <Text style={styles.dateDate}>{getDayAndDate().date}</Text>
      </View> */}

      {/* Other Quick Links */}
      <View style={styles.cards}>
        {/* Medication Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Medication')}
          style={styles.card}>
         <View style={styles.cardImageContainer}>
           {/* <Image
            source={require('../../../assets/images/medication.png')}
            style={styles.cardImage}
          /> */}
            <Icon name="medkit" size={24} color={COLORS.text} />
         </View>
          <View style={styles.cardTextContainer}>
            {/* <Text style={styles.cardHeader}>Medication</Text> */}
            <Text style={styles.cardSubheading}>View and track your medicines</Text>
          </View>
        </TouchableOpacity>

        {/* Connections Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Connections')}
          style={styles.card}>
         <View style={styles.cardImageContainer}>
           {/* <Image
             source={require('../../../assets/images/connections.png')}
             style={styles.cardImage}
           /> */}
           <Icon name="people" size={24} color={COLORS.text} />
         </View>
          <View style={styles.cardTextContainer}>
            {/* <Text style={styles.cardHeader}>Connections</Text> */}
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
    backgroundColor: COLORS.background,
  },
  headerBar: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    padding: 20,
    // marginBottom: 10,
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
    // marginTop: -10,
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: COLORS.textSecondary,
  },
  profilePicture: {
    width: 54,
    height: 54,
    borderRadius: 100,
  },
  dateContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
        padding: 20,
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
        padding: 20,
    marginTop: 20,
    // gap: 20,
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'column',
    width: '48%',
    // alignItems: 'center',
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
  cardImageContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#525252',
    padding: 6,
    borderRadius:100
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTextContainer: {
    // flex: 1,
    marginTop: 15,
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
