import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button, Input, List, ListItem, useTheme } from '@ui-kitten/components';
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
  const theme = useTheme();
  const unsavedDevices = devices.filter(device =>
    !savedDevices.some(saved => saved.id === device.id)
  );

  return (
    <Layout style={[styles.container, { backgroundColor: theme['color-basic-100'] }]}>
      <Text
        category="h4"
        style={[styles.title, { color: theme['color-basic-800'] }]}
      >
        Bluetooth Tracker
      </Text>

      <Button
        onPress={startScan}
        style={styles.button}
        status="primary"
      >
        Start Scan
      </Button>

      <Text
        category="s1"
        style={[styles.subtitle, { color: theme['color-basic-800'] }]}
      >
        Available Devices:
      </Text>

      <List
        data={unsavedDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={<Text style={{ color: theme['color-basic-800'] }}>{item.name ?? item.id}</Text>}
            onPress={() => startTracking(item)}
          />
        )}
      />

      {trackingDevice && (
        <Layout style={[styles.trackingContainer, { backgroundColor: theme['color-basic-200'] }]}>
          <Text category="s1" style={{ color: theme['color-basic-800'] }}>
            Tracking: {trackingDevice.name ?? trackingDevice.id}
          </Text>
          <Text category="s2" style={{ color: theme['color-basic-800'] }}>
            RSSI: {rssi !== null ? rssi : 'Reading...'}
          </Text>

          <Input
            placeholder="Enter custom name"
            value={customName}
            onChangeText={setCustomName}
            style={styles.input}
            placeholderTextColor={theme['color-basic-600']}
          />
          <Button
            onPress={() => {
              saveDevice(trackingDevice, customName);
              setCustomName('');
            }}
            style={styles.button}
            status="primary"
          >
            Save Device
          </Button>
          <Button
            onPress={stopTracking}
            style={styles.button}
            status="danger"
          >
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
  },
  input: {
    marginVertical: 8,
  },
});

export default TrackerScreen;
