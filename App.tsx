import React, { useEffect } from 'react';
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

  let sound: Sound | null = null;

  useEffect(() => {
    // Load the sound file
    // eslint-disable-next-line react-hooks/exhaustive-deps
    sound = new Sound('play.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
    });

    return () => {
      // Release the sound resource when the component unmounts
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const playSoundInBackground = () => {
    // Maximize the volume
    VolumeControl.change(1.0);

    // Play sound
    if (sound) {
      sound.setNumberOfLoops(-1); // Infinite loop
      sound.play((success) => {
        if (!success) {
          console.error('Failed to play sound');
        }
      });
    }

    // Start a background task
    BackgroundTimer.runBackgroundTimer(() => {
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
