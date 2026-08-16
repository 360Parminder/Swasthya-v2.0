import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Ambient', true);

let tickSound = null;
let lastPlayTime = 0;

// Initialize sound instance
try {
  tickSound = new Sound('tick.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      // Fallback or silently handle
    }
  });
} catch (e) {
  // Silent fallback
}

/**
 * Play a fast, lightweight mechanical tick sound with throttling
 */
export const playTickSound = (minIntervalMs = 45) => {
  const now = Date.now();
  if (now - lastPlayTime < minIntervalMs) {
    return;
  }
  lastPlayTime = now;

  if (tickSound) {
    try {
      tickSound.stop(() => {
        tickSound.setVolume(0.6);
        tickSound.play();
      });
    } catch (e) {
      // Ignore playback errors gracefully
    }
  }
};
