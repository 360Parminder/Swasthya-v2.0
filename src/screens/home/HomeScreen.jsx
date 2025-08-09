import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { COLORS } from '../../components/ui/colors';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: authState?.user?.avatar }}
            style={styles.profilePicture}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.title}>Hello</Text>
            <Text style={styles.subtitle}>{authState?.user?.username || 'User'}</Text>
          </View>
        </View>
      </View>

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
    // paddingTop: ,
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    // backgroundColor: '#1F2127',
    width: '100%',
    marginBottom: 10, 
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik-Regular',
    color: COLORS.text,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Rubik-SemiBold',
    color: COLORS.textSecondary,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10,
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
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
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
