// TrackerScreen.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Layout,
  Text,
  Button,
  Input,
  List,
  ListItem,
} from '@ui-kitten/components';
// Import the Device type from the BLE library and alias it for clarity
import { Device as BLEDevice } from 'react-native-ble-plx';

// Define a type for saved devices if they differ from the BLE device type.
// Here we assume saved devices require a non-null name.
export interface SavedDevice {
  id: string;
  name: string;
}

interface TrackerScreenProps {
  devices: BLEDevice[];
  trackingDevice: BLEDevice | null;
  rssi: number | null;
  startScan: () => void;
  startTracking: (device: BLEDevice) => Promise<void>; // if this one is async, leave as Promise<void>
  stopTracking: () => void;
  savedDevices: SavedDevice[];
  // Updated the signature for saveDevice:
  saveDevice: (device: BLEDevice, customName?: string) => void;
  connectToSavedDevice: (device: SavedDevice) => Promise<void>;
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
  connectToSavedDevice,
  customName,
  setCustomName,
}) => {
  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.title}>
        Bluetooth RSSI Tracker with Sound
      </Text>

      <Button onPress={startScan} style={styles.button}>
        Start Scan
      </Button>

      <Text category="s1" style={styles.subtitle}>
        Available Devices:
      </Text>
      <List
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            // Use a fallback with the nullish coalescing operator in case name is null
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

          {/* Lottie Animation for tracking (ensure the JSON file exists in your assets folder) */}


          <Input
            placeholder="Enter custom name"
            value={customName}
            onChangeText={setCustomName}
            style={styles.input}
          />
          <Button
            onPress={() => {
              // Call saveDevice and then clear the custom name
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

      <Text category="s1" style={styles.subtitle}>
        Saved Devices:
      </Text>
      <List
        data={savedDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            onPress={() => connectToSavedDevice(item)}
          />
        )}
      />
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
  lottie: {
    width: '100%',
    height: 150,
    marginVertical: 16,
  },
});

export default TrackerScreen;
