// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { ApplicationProvider, IconRegistry, Tab, TabView, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import TrackerScreen from './TrackerScreen';
import SavedDevicesScreen from './SavedDevicesScreen';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';

const App = (): React.JSX.Element => {
  const [selectedTab, setSelectedTab] = useState(0);
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

  useEffect(() => {
    if (rssi !== null) {
      rssi < -60 ? playSound() : stopSound();
    }
  }, [rssi, playSound, stopSound]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <TabView
            selectedIndex={selectedTab}
            onSelect={index => setSelectedTab(index)}
            style={{ flex: 1 }}
            tabBarStyle={{ paddingVertical: 8 }}
          >
            <Tab title={<Text>TRACK</Text>}>
              <Layout style={{ flex: 1 }}>
                <TrackerScreen
                  devices={devices}
                  trackingDevice={trackingDevice}
                  rssi={rssi}
                  startScan={startScan}
                  startTracking={startTracking}
                  stopTracking={stopTracking}
                  savedDevices={savedDevices}
                  saveDevice={saveDevice}
                  customName={customName}
                  setCustomName={setCustomName}
                />
              </Layout>
            </Tab>
            <Tab title={<Text>SAVED DEVICES</Text>}>
              <Layout style={{ flex: 1 }}>
                <SavedDevicesScreen
                  savedDevices={savedDevices}
                  connectToSavedDevice={connectToSavedDevice}
                />
              </Layout>
            </Tab>
          </TabView>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
};

export default App;