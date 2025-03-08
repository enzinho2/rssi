import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, List, ListItem, useTheme } from '@ui-kitten/components';
import { SavedDevice } from './types';

interface SavedDevicesScreenProps {
  savedDevices: SavedDevice[];
  connectToSavedDevice: (device: SavedDevice) => Promise<void>;
}

const SavedDevicesScreen: React.FC<SavedDevicesScreenProps> = ({
  savedDevices,
  connectToSavedDevice,
}) => {
  const theme = useTheme();

  return (
    <Layout style={[styles.container, { backgroundColor: theme['color-basic-100'] }]}>
      <Text 
        category="h4" 
        style={[styles.title, { color: theme['color-basic-800'] }]}
      >
        Saved Devices
      </Text>
      
      <List
        data={savedDevices}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme['color-basic-800'] }]}>
            No saved devices found
          </Text>
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={<Text style={{ color: theme['color-basic-800'] }}>{item.name}</Text>}
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