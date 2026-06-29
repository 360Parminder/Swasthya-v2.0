import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { alarmService } from '../../services/alarmService';
import { notificationService } from '../../services/notificationService';
import { dashboardApi } from '../../api/dashboard';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { AlarmClockIcon, Tick02Icon, Moon02Icon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../components/ui/colors';

const { width } = Dimensions.get('window');

const AlarmScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
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
          <HugeiconsIcon icon={AlarmClockIcon} size={64} color={COLORS.primary} />
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
             <HugeiconsIcon icon={Tick02Icon} size={24} color={COLORS.buttonText} style={styles.btnIcon} />
             <Text style={styles.buttonText}>Take Now</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={[styles.button, styles.snoozeButton]} onPress={handleSnooze}>
             <HugeiconsIcon icon={Moon02Icon} size={24} color={COLORS.textSecondary} style={styles.btnIcon} />
             <Text style={[styles.buttonText, styles.snoozeText]}>Snooze (10m)</Text>
           </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.healthCardText,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  medicationCard: {
    backgroundColor: COLORS.healthCardBackground,
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
    color: COLORS.healthCardText,
    marginBottom: 8,
  },
  medDosage: {
    fontSize: 18,
    color: COLORS.healthCardSubtext,
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
    backgroundColor: COLORS.primary,
  },
  snoozeButton: {
    backgroundColor: COLORS.border,
  },
  btnIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.buttonText,
  },
  snoozeText: {
    color: COLORS.textSecondary,
  }
});

export default AlarmScreen;
