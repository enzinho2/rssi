/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
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
  ToastAndroid,
  Platform,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import Sound from 'react-native-sound';
import VolumeControl from 'react-native-volume-control';
import BackgroundTimer from 'react-native-background-timer';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const bleManager = new BleManager();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
  };

  // States
  const [devices, setDevices] = useState<Device[]>([]);
  const [trackingDevice, setTrackingDevice] = useState<Device | null>(null);
  const [rssi, setRssi] = useState<number | null>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Sound | null>(null);

  // Request necessary permissions for Android
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      const locationPermission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (locationPermission !== RESULTS.GRANTED) {
        console.log('❌ Location permission denied');
      }

      if (Platform.Version >= 31) {
        const btScan = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
        const btConnect = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);

        if (btScan !== RESULTS.GRANTED || btConnect !== RESULTS.GRANTED) {
          console.log('❌ Bluetooth permissions denied');
        }
      }
    }
  };

  // Load sound on mount
  useEffect(() => {
    requestBluetoothPermissions(); // Request permissions on app startup

    const sound = new Sound('play.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  // Start scanning for devices
  const startScan = () => {
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }
      if (device && device.id) {
        setDevices((prevDevices) => {
          if (!prevDevices.some((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 10000);
  };

  // Select a device and start tracking RSSI
  const startTracking = async (device: Device) => {
    setTrackingDevice(device);
    setRssi(null);

    try {
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log(`Connected to ${connectedDevice.name}`);

      // Start RSSI loop
      trackingInterval.current = setInterval(async () => {
        try {
          const updatedDevice = await connectedDevice.readRSSI();
          const rssiValue = updatedDevice.rssi; // Get the RSSI value
          setRssi(rssiValue); // Update the state
          console.log(`RSSI: ${rssiValue}`);

          // Ensure rssiValue is a number before calling handleSoundControl
          if (typeof rssiValue === 'number') {
            handleSoundControl(rssiValue);
          }
        } catch (error) {
          console.error('Error reading RSSI:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // Stop tracking RSSI
  const stopTracking = () => {
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }
    if (trackingDevice) {
      bleManager.cancelDeviceConnection(trackingDevice.id);
    }
    setTrackingDevice(null);
    setRssi(null);
    stopSound();
  };

  // Play sound when RSSI is strong enough
  const handleSoundControl = (rssiValue: number) => {
    const sound = soundRef.current;
    if (!sound) {return;}

    if (rssiValue < -60) {
      if (!sound.isPlaying()) {
        VolumeControl.change(1.0);
        sound.setNumberOfLoops(-1);
        sound.play((success) => {
          if (!success) {
            console.error('Failed to play sound');
          }
        });

        BackgroundTimer.runBackgroundTimer(() => {
          VolumeControl.change(1.0);
          if (!sound.isPlaying()) {
            sound.play();
          }
        }, 1000);

        ToastAndroid.show('Playing sound in the background!', ToastAndroid.SHORT);
      }
    } else {
      stopSound();
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
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
              <Button title="Stop Tracking" onPress={stopTracking} />
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
