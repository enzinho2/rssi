// TrackerScreen.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button, Input, List, ListItem } from '@ui-kitten/components';
import { BLEDevice, SavedDevice } from './types';

interface TrackerScreenProps {
  devices: BLEDevice[];
  trackingDevice: BLEDevice | null;
  rssi: number | null;
  startScan: () => void;
  startTracking: (device: BLEDevice) => Promise<void>;
  stopTracking: () => void;
  savedDevices: SavedDevice[];
  saveDevice: (device: BLEDevice, customName?: string) => void;
  customName: string;
  setCustomName: (value: string) => void;
}

const TrackerScreen: React.FC<TrackerScreenProps> = ({
  devices,
  trackingDevice,
  rssi,
  startScan,
  startTracking,
  stopTracking,
  savedDevices,
  saveDevice,
  customName,
  setCustomName,
}) => {
  // Filter out saved devices from the available devices list
  const unsavedDevices = devices.filter(device => 
    !savedDevices.some(saved => saved.id === device.id)
  );

  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.title}>
        Bluetooth Tracker
      </Text>

      <Button onPress={startScan} style={styles.button}>
        Start Scan
      </Button>

      <Text category="s1" style={styles.subtitle}>
        Available Devices:
      </Text>
      <List
        data={unsavedDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name ?? item.id}
            onPress={() => startTracking(item)}
          />
        )}
      />

      {trackingDevice && (
        <Layout style={styles.trackingContainer}>
          <Text category="s1">
            Tracking: {trackingDevice.name ?? trackingDevice.id}
          </Text>
          <Text category="s2">
            RSSI: {rssi !== null ? rssi : 'Reading...'}
          </Text>

          <Input
            placeholder="Enter custom name"
            value={customName}
            onChangeText={setCustomName}
            style={styles.input}
          />
          <Button
            onPress={() => {
              saveDevice(trackingDevice, customName);
              setCustomName('');
            }}
            style={styles.button}
          >
            Save Device
          </Button>
          <Button onPress={stopTracking} style={styles.button} status="danger">
            Stop Tracking
          </Button>
        </Layout>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 16,
  },
  subtitle: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 8,
  },
  trackingContainer: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  input: {
    marginVertical: 8,
  },
});

export default TrackerScreen;