import notifee, { AndroidImportance, TriggerType, AndroidCategory, AndroidVisibility } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  async requestPermissions() {
    await notifee.requestPermission();
    
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'medication_alarm',
        name: 'Medication Alarm',
        importance: AndroidImportance.HIGH,
        sound: 'alarm', // Matches android/app/src/main/res/raw/alarm.mp3
        vibration: true,
        vibrationPattern: [0, 500, 200, 500],
      });
    }
  }

  async scheduleMedicationReminder(medication, triggerDate) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    const identifier = await notifee.createTriggerNotification(
      {
        title: `Time for ${medication.name}`,
        body: `Dosage: ${medication.dosage}`,
        data: { medicationId: medication._id, action: 'medication_alarm', medication: JSON.stringify(medication) },
        android: {
          channelId: 'medication_alarm',
          category: AndroidCategory.ALARM,
          visibility: AndroidVisibility.PUBLIC,
          sound: 'alarm',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          fullScreenAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'alarm.wav', // if iOS has alarm.wav
          critical: true,
        },
      },
      trigger
    );
    return identifier;
  }

  async cancelNotification(identifier) {
    if (identifier) {
      await notifee.cancelNotification(identifier);
    }
  }

  async cancelAllNotifications() {
     await notifee.cancelAllNotifications();
  }
}

export const notificationService = new NotificationService();
