// App.tsx
import React, { useEffect, useState } from 'react';
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
  TextInput,
} from 'react-native';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
  };

  const {
    devices,
    trackingDevice,
    rssi,
    startScan,
    startTracking,
    stopTracking,
    savedDevices,
    saveDevice,
    connectToSavedDevice,
  } = useBluetooth();
  const { playSound, stopSound } = useSound();
  const [customName, setCustomName] = useState('');

  // Control sound playback based on RSSI changes.
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
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }]}>
          <Text style={styles.sectionTitle}>Bluetooth RSSI Tracker with Sound</Text>
          <Button title="Start Scan" onPress={startScan} />

          {/* Scanned Devices */}
          <Text style={styles.subTitle}>Available Devices:</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Button title={item.name || item.id} onPress={() => startTracking(item)} />
            )}
          />

          {/* Tracking Device Section */}
          {trackingDevice && (
            <View style={styles.trackingContainer}>
              <Text style={styles.trackingText}>
                Tracking: {trackingDevice.name || trackingDevice.id}
              </Text>
              <Text style={styles.trackingText}>
                RSSI: {rssi !== null ? rssi : 'Reading...'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter custom name"
                value={customName}
                onChangeText={setCustomName}
              />
              <Button
                title="Save Device"
                onPress={() => {
                  saveDevice(trackingDevice, customName);
                  setCustomName('');
                }}
              />
              <Button
                title="Stop Tracking"
                onPress={() => {
                  stopTracking();
                  stopSound();
                }}
              />
            </View>
          )}

          {/* Saved Devices Section */}
          <Text style={styles.subTitle}>Saved Devices:</Text>
          <FlatList
            data={savedDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Button title={item.name} onPress={() => connectToSavedDevice(item)} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
  },
  trackingContainer: {
    marginTop: 20,
  },
  trackingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default App;
