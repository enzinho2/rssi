// App.tsx
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
  FlatList,
} from 'react-native';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
  };

  const { devices, trackingDevice, rssi, startScan, startTracking, stopTracking } =
    useBluetooth();
  const { playSound, stopSound } = useSound();

  // Control sound playback based on RSSI changes
  useEffect(() => {
    if (rssi !== null) {
      if (rssi < -60) {
        playSound();
      } else {
        stopSound();
      }
    }
  }, [rssi, playSound, stopSound]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', padding: 20 }}>
          <Text style={styles.sectionTitle}>Bluetooth RSSI Tracker with Sound</Text>
          <Button title="Start Scan" onPress={startScan} />
          <Text>Available Devices:</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Button title={item.name || 'Unnamed Device'} onPress={() => startTracking(item)} />
            )}
          />

          {trackingDevice && (
            <View>
              <Text>Tracking: {trackingDevice.name || 'Unnamed Device'}</Text>
              <Text>RSSI: {rssi !== null ? rssi : 'Reading...'}</Text>
              <Button
                title="Stop Tracking"
                onPress={() => {
                  stopTracking();
                  stopSound();
                }}
              />
            </View>
          )}
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
