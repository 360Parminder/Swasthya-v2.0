import notifee, {
  AndroidImportance,
  TriggerType,
  AndroidCategory,
  AndroidVisibility,
  RepeatFrequency,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  async requestPermissions() {
    try {
      const settings = await notifee.requestPermission();
      console.log('Notification permission status:', settings.authorizationStatus);

      if (Platform.OS === 'android') {
        // High priority alarm channel
        await notifee.createChannel({
          id: 'medication_alarm',
          name: 'Medication Alarm',
          importance: AndroidImportance.HIGH,
          sound: 'alarm', // Matches android/app/src/main/res/raw/alarm.mp3
          vibration: true,
          vibrationPattern: [300, 500, 300, 500],
        });

        // Standard notification reminder channel
        await notifee.createChannel({
          id: 'medication_reminders',
          name: 'Medication Reminders',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
          vibrationPattern: [300, 400, 300, 400],
        });

        // Care Circle Invites channel
        await notifee.createChannel({
          id: 'care_circle_invites',
          name: 'Care Circle Invites',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
          vibrationPattern: [300, 500, 300, 500],
        });
      }
      return settings;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  }

  /**
   * Parse various time formats into hour and minute (24h)
   * Supports: "08:00 AM", "8:30 PM", "14:30", Date objects, ISO strings
   */
  parseTimeToHoursMinutes(timeVal) {
    if (!timeVal) return null;

    if (timeVal instanceof Date) {
      return { hours: timeVal.getHours(), minutes: timeVal.getMinutes() };
    }

    if (typeof timeVal === 'object' && timeVal.reception_time) {
      const d = new Date(timeVal.reception_time);
      if (!isNaN(d.getTime())) {
        return { hours: d.getHours(), minutes: d.getMinutes() };
      }
    }

    if (typeof timeVal === 'string') {
      // Check if it is an ISO date string
      if (timeVal.includes('T') || timeVal.includes('-')) {
        const d = new Date(timeVal);
        if (!isNaN(d.getTime())) {
          return { hours: d.getHours(), minutes: d.getMinutes() };
        }
      }

      // 12-hour format e.g. "08:30 AM", "8:00 PM"
      const match12 = timeVal.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match12) {
        let hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const period = match12[3]?.toUpperCase();

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return { hours, minutes };
      }
    }

    return null;
  }

  /**
   * Schedules a single medication reminder trigger notification
   */
  async scheduleMedicationReminder(medication, triggerDate) {
    try {
      const medName =
        medication?.name ||
        medication?.record?.[0]?.medicine_name ||
        medication?.medicine_name ||
        'Medication';

      const medDosage =
        medication?.dosage ||
        `${medication?.record?.[0]?.strength || ''} ${medication?.record?.[0]?.unit || ''}`.trim() ||
        '1 dose';

      const medId = medication?._id || medication?.id || `med-${Date.now()}`;

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      const identifier = await notifee.createTriggerNotification(
        {
          id: `med_${medId}_${triggerDate.getTime()}`,
          title: `💊 Time for ${medName}`,
          body: `Dose: ${medDosage}. Tap to view or log your intake.`,
          data: {
            medicationId: medId,
            action: 'medication_alarm',
            medication: JSON.stringify(medication),
          },
          android: {
            channelId: 'medication_alarm',
            category: AndroidCategory.ALARM,
            importance: AndroidImportance.HIGH,
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
            sound: 'alarm.wav',
            critical: true,
          },
        },
        trigger
      );

      console.log(`[NotificationService] Scheduled reminder for ${medName} at ${triggerDate.toLocaleString()}`);
      return identifier;
    } catch (error) {
      console.error('[NotificationService] Error scheduling medication reminder:', error);
    }
  }

  /**
   * Syncs and schedules reminders for all active medications
   */
  async syncMedicationReminders(medicationsList) {
    if (!Array.isArray(medicationsList) || medicationsList.length === 0) {
      return;
    }

    try {
      await this.requestPermissions();

      const now = new Date();

      for (const med of medicationsList) {
        const record = med?.record?.[0] || med;
        const times = record?.times || med?.times || [];

        if (!Array.isArray(times) || times.length === 0) continue;

        for (const timeEntry of times) {
          const parsed = this.parseTimeToHoursMinutes(timeEntry);
          if (!parsed) continue;

          // Calculate next trigger time (today or tomorrow)
          const triggerDate = new Date();
          triggerDate.setHours(parsed.hours, parsed.minutes, 0, 0);

          if (triggerDate.getTime() <= now.getTime()) {
            // If already passed today, schedule for tomorrow
            triggerDate.setDate(triggerDate.getDate() + 1);
          }

          await this.scheduleMedicationReminder(med, triggerDate);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Error syncing medication reminders:', error);
    }
  }

  /**
   * Display an immediate test notification
   */
  async displayNotification(title, body, data = {}) {
    try {
      await this.requestPermissions();

      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId: 'medication_reminders',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('[NotificationService] Error displaying notification:', error);
    }
  }

  /**
   * Display Care Circle Invite notification
   */
  async displayInviteNotification(senderName, data = {}) {
    try {
      await this.requestPermissions();

      await notifee.displayNotification({
        title: '🤝 Care Circle Invite',
        body: `${senderName || 'A user'} invited you to connect on Swasthya. Tap to view and accept.`,
        data: {
          action: 'open_notifications',
          ...data,
        },
        android: {
          channelId: 'care_circle_invites',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          sound: 'default',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (error) {
      console.error('[NotificationService] Error displaying invite notification:', error);
    }
  }

  /**
   * Retrieves or generates a persistent device push FCM token
   */
  async getDeviceToken() {
    try {
      let token = null;
      let apnsToken = null;

      try {
        const messaging = require('@react-native-firebase/messaging').default || require('@react-native-firebase/messaging');
        if (messaging) {
          // On iOS, must request permission and register for remote messages first
          if (Platform.OS === 'ios') {
            try {
              const authStatus = await messaging().requestPermission();
              console.log('[NotificationService] iOS Push Auth Status:', authStatus);
              await messaging().registerDeviceForRemoteMessages();
              apnsToken = await messaging().getAPNSToken();
            } catch (iosErr) {
              console.log('⚠️ [NotificationService] iOS remote registration notice:', iosErr?.message);
            }
          }

          token = await messaging().getToken();
        }
      } catch (e) {
        console.log('[NotificationService] Firebase messaging error:', e?.message);
      }

      if (!token) {
        token = await AsyncStorage.getItem('fcm_token');
      }

      if (!token) {
        token = `swasthya_fcm_${Platform.OS}_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      }

      if (token) {
        await AsyncStorage.setItem('fcm_token', token);
      }

      // Explicit Console Logging for iOS Device Token
      console.log('\n======================================================');
      console.log(`📱 [${Platform.OS.toUpperCase()} DEVICE TOKEN] FCM TOKEN:`);
      console.log(token);
      if (apnsToken) {
        console.log('🍏 [iOS APNS DEVICE TOKEN]:');
        console.log(apnsToken);
      }
      console.log('======================================================\n');

      return token;
    } catch (err) {
      console.log('Error getting device token:', err?.message);
      return null;
    }
  }

  /**
   * Syncs the device FCM token with backend user record
   */
  async syncFcmToken() {
    try {
      const token = await this.getDeviceToken();
      if (token) {
        const { authApi } = require('../api/authApi');
        const res = await authApi.updateFcmToken(token);
        console.log('[NotificationService] FCM Token synced with backend:', res?.data?.message || 'Success');
      }
    } catch (error) {
      console.log('[NotificationService] Failed to sync FCM token with backend:', error?.response?.data?.message || error?.message);
    }
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
