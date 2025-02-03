// useSound.ts
import { useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import VolumeControl from 'react-native-volume-control';
import BackgroundTimer from 'react-native-background-timer';
import { ToastAndroid } from 'react-native';

export const useSound = () => {
  const soundRef = useRef<Sound | null>(null);

  // Load the sound on mount
  useEffect(() => {
    const sound = new Sound('play.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
    });
    soundRef.current = sound;

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  // Start playing sound
  const playSound = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (!sound.isPlaying()) {
      VolumeControl.change(1.0);
      sound.setNumberOfLoops(-1);
      sound.play((success) => {
        if (!success) {
          console.error('Failed to play sound');
        }
      });

      // Ensure continuous playback in the background
      BackgroundTimer.runBackgroundTimer(() => {
        VolumeControl.change(1.0);
        if (!sound.isPlaying()) {
          sound.play();
        }
      }, 1000);

      ToastAndroid.show('Playing sound in the background!', ToastAndroid.SHORT);
    }
  };

  // Stop sound playback
  const stopSound = () => {
    const sound = soundRef.current;
    if (sound && sound.isPlaying()) {
      sound.stop();
      BackgroundTimer.stopBackgroundTimer();
    }
  };

  return {
    playSound,
    stopSound,
  };
};
