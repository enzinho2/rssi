// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import TrackerScreen from './TrackerScreen';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';
// Import BLEDevice type for clarity (if needed)

const App = (): React.JSX.Element => {
  const {
    devices, // Expected to be BLEDevice[]
    trackingDevice, // BLEDevice | null
    rssi,
    startScan,
    startTracking, // Should have signature: (device: BLEDevice) => Promise<void>
    stopTracking,
    savedDevices, // Ensure these are of type SavedDevice[] (with name: string)
    saveDevice, // (device: BLEDevice, customName: string) => Promise<void>
    connectToSavedDevice, // (device: SavedDevice) => Promise<void>
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
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <TrackerScreen
            devices={devices}
            trackingDevice={trackingDevice}
            rssi={rssi}
            startScan={startScan}
            startTracking={startTracking}
            stopTracking={stopTracking}
            savedDevices={savedDevices}
            saveDevice={saveDevice}
            connectToSavedDevice={connectToSavedDevice}
            customName={customName}
            setCustomName={setCustomName}
          />
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
};

export default App;
