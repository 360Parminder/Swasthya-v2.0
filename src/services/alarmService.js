import Sound from 'react-native-sound';
import { Vibration } from 'react-native';

class AlarmService {
  constructor() {
    this.sound = null;
    this.isRinging = false;
    // 'Playback' allows audio to play in silent mode
    Sound.setCategory('Playback', true);
  }

  startAlarm() {
    if (this.isRinging) return;
    this.isRinging = true;

    // Load sound from the app bundle
    this.sound = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        this.isRinging = false;
        return;
      }
      this.sound.setNumberOfLoops(-1); // Loop indefinitely
      this.sound.play((success) => {
        if (!success) {
          console.log('Playback failed');
        }
      });
    });

    Vibration.vibrate([0, 1000, 500], true); // Repeating vibration
  }

  stopAlarm() {
    if (!this.isRinging) return;
    if (this.sound) {
      this.sound.stop(() => {
        this.sound.release();
        this.sound = null;
      });
    }
    Vibration.cancel();
    this.isRinging = false;
  }
}

export const alarmService = new AlarmService();
