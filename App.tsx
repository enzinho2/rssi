// App.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';

// A custom button using Pressable so we can style it with Tailwind classes.
const TWButton = ({
  title,
  onPress,
  extraClasses = '',
}: {
  title: string;
  onPress: () => void;
  extraClasses?: string;
}) => (
  <Pressable onPress={onPress} className={`bg-blue-500 py-2 px-4 rounded ${extraClasses}`}>
    <Text className="text-white text-center">{title}</Text>
  </Pressable>
);

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

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
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-800">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#333333' : '#FFFFFF'}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="bg-white dark:bg-gray-800">
        <View className="p-5 bg-white dark:bg-black">
          {/* Header */}
          <Text className="text-2xl font-semibold mb-5 text-center text-black dark:text-white">
            Bluetooth RSSI Tracker with Sound
          </Text>

          {/* Scan Button */}
          <TWButton title="Start Scan" onPress={startScan} extraClasses="mb-4" />

          {/* Available Devices */}
          <Text className="text-lg font-medium mt-5 mb-2 text-black dark:text-white">
            Available Devices:
          </Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-2">
                <TWButton title={item.name || item.id} onPress={() => startTracking(item)} />
              </View>
            )}
          />

          {/* Tracking Device Section */}
          {trackingDevice && (
            <View className="mt-5">
              <Text className="text-base text-black dark:text-white mb-2">
                Tracking: {trackingDevice.name || trackingDevice.id}
              </Text>
              <Text className="text-base text-black dark:text-white mb-2">
                RSSI: {rssi !== null ? rssi : 'Reading...'}
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-3 text-black dark:text-white"
                placeholder="Enter custom name"
                placeholderTextColor={isDarkMode ? '#A0AEC0' : '#718096'}
                value={customName}
                onChangeText={setCustomName}
              />
              <TWButton
                title="Save Device"
                onPress={() => {
                  saveDevice(trackingDevice, customName);
                  setCustomName('');
                }}
                extraClasses="mb-2"
              />
              <TWButton
                title="Stop Tracking"
                onPress={() => {
                  stopTracking();
                  stopSound();
                }}
              />
            </View>
          )}

          {/* Saved Devices Section */}
          <Text className="text-lg font-medium mt-5 mb-2 text-black dark:text-white">
            Saved Devices:
          </Text>
          <FlatList
            data={savedDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-2">
                <TWButton title={item.name} onPress={() => connectToSavedDevice(item)} />
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
