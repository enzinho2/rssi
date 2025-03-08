// SavedDevicesScreen.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, List, ListItem } from '@ui-kitten/components';
import { SavedDevice } from './types';

interface SavedDevicesScreenProps {
  savedDevices: SavedDevice[];
  connectToSavedDevice: (device: SavedDevice) => Promise<void>;
}

const SavedDevicesScreen: React.FC<SavedDevicesScreenProps> = ({
  savedDevices,
  connectToSavedDevice,
}) => {
  return (
    <Layout style={styles.container}>
      <Text category="h4" style={styles.title}>
        Saved Devices
      </Text>
      
      <List
        data={savedDevices}
        ListEmptyComponent={<Text style={styles.emptyText}>No saved devices found</Text>}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={<Text>{item.name}</Text>}
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  }
});

export default SavedDevicesScreen;