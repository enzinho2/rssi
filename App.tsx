import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  ToastAndroid,
} from 'react-native';
import Sound from 'react-native-sound';
import VolumeControl from 'react-native-volume-control';
import BackgroundTimer from 'react-native-background-timer';

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
  };

  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Initialize the sound
    const sound = new Sound('play.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
    });

    // Store the sound instance in the ref
    soundRef.current = sound;

    return () => {
      // Release the sound when the component unmounts
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  const playSoundInBackground = () => {
    // Ensure the volume is maximized before playing
    VolumeControl.change(1.0);

    const sound = soundRef.current;

    if (sound) {
      sound.setNumberOfLoops(-1); // Infinite loop
      sound.play((success) => {
        if (!success) {
          console.error('Failed to play sound');
        }
      });
    }

    // Start a background task to ensure volume stays at max
    BackgroundTimer.runBackgroundTimer(() => {
      // Set volume to maximum every second
      VolumeControl.change(1.0);

      // Ensure the sound is still playing
      if (sound && !sound.isPlaying()) {
        sound.play();
      }
    }, 1000);

    ToastAndroid.show('Playing sound in the background!', ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
            padding: 20,
          }}>
          <Text style={styles.sectionTitle}>Background Sound App</Text>
          <Button title="Play Sound" onPress={playSoundInBackground} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;
