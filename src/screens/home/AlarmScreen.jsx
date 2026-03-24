import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { alarmService } from '../../services/alarmService';
import { notificationService } from '../../services/notificationService';
import { dashboardApi } from '../../api/dashboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const AlarmScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [medication, setMedication] = useState(route.params?.medication || null);
  
  useEffect(() => {
    // Start playing alarm when screen mounts
    alarmService.startAlarm();

    return () => {
      // Must stop when unmounting
      alarmService.stopAlarm();
    };
  }, []);

  const handleTaken = async () => {
    await alarmService.stopAlarm();

    // Optionally mark it taken on backend or in local state
    try {
      if (medication?._id) {
         // await dashboardApi.markMedicationTaken(medication._id); 
      }
    } catch(err) {
      console.log('Error marking taken', err);
    }
    
    // Go to home, you might want to configure standard navigation.
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTab' }], // Or whatever the root is
    });
  };

  const handleSnooze = async () => {
    await alarmService.stopAlarm();
    
    // schedule new alarm 10 minutes from now (configurable)
    const snoozeDate = new Date(Date.now() + 10 * 60000); // 10 minutes
    
    if (medication) {
      await notificationService.scheduleMedicationReminder(medication, snoozeDate);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTab' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.iconContainer}>
          <Icon name="bell-ring" size={64} color="#0F766E" />
        </View>
        
        <Text style={styles.timeText}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})}</Text>
        
        <Text style={styles.title}>Medication Time!</Text>

        {medication && (
          <View style={styles.medicationCard}>
             <Text style={styles.medName}>{medication.medicine_name || medication.name}</Text>
             <Text style={styles.medDosage}>{medication.dosage || (medication.strength ? `${medication.strength} ${medication.unit}` : '')}</Text>
          </View>
        )}

        <View style={styles.actions}>
           <TouchableOpacity style={[styles.button, styles.takenButton]} onPress={handleTaken}>
             <Icon name="check" size={24} color="#FFF" style={styles.btnIcon} />
             <Text style={styles.buttonText}>Take Now</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={[styles.button, styles.snoozeButton]} onPress={handleSnooze}>
             <Icon name="sleep" size={24} color="#4B5563" style={styles.btnIcon} />
             <Text style={[styles.buttonText, styles.snoozeText]}>Snooze (10m)</Text>
           </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 40,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    width: width - 48,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  medName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  medDosage: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  actions: {
    width: width - 48,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takenButton: {
    backgroundColor: '#0F766E',
  },
  snoozeButton: {
    backgroundColor: '#E5E7EB',
  },
  btnIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  snoozeText: {
    color: '#4B5563',
  }
});

export default AlarmScreen;
