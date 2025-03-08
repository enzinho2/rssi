import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import {
  ApplicationProvider,
  IconRegistry,
  Tab,
  TabView,
  Layout,
  Text,
  Button,
  useTheme,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { lightTheme, darkTheme, AppThemeType } from './theme';
import TrackerScreen from './TrackerScreen';
import SavedDevicesScreen from './SavedDevicesScreen';
import { useBluetooth } from './useBluetooth';
import { useSound } from './useSound';

const App = (): React.JSX.Element => {
  const [themeMode, setThemeMode] = useState<AppThemeType>('light');
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
      <ApplicationProvider
        {...eva}
        theme={themeMode === 'light' ? lightTheme : darkTheme}
        customMapping={eva.mapping}
      >
        <AppContent
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          bluetoothProps={{
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
            setCustomName
          }}
        />
      </ApplicationProvider>
    </>
  );
};

const AppContent = ({
  themeMode,
  setThemeMode,
  selectedTab,
  setSelectedTab,
  bluetoothProps
}: {
  themeMode: AppThemeType;
  setThemeMode: (mode: AppThemeType) => void;
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  bluetoothProps: any;
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme['color-basic-100'] }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      <Button
        style={styles.themeToggle}
        appearance='ghost'
        onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        accessoryLeft={<Text>🌓</Text>}
      />

      <TabView
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
        style={styles.tabView}
        tabBarStyle={{
          backgroundColor: theme['color-basic-100'],
          paddingVertical: 8,
        }}
      >
        <Tab title={<Text style={{ color: theme['color-basic-800'] }}>TRACK</Text>}>
          <Layout style={styles.tabContent}>
            <TrackerScreen {...bluetoothProps} />
          </Layout>
        </Tab>
        <Tab title={<Text style={{ color: theme['color-basic-800'] }}>SAVED DEVICES</Text>}>
          <Layout style={styles.tabContent}>
            <SavedDevicesScreen {...bluetoothProps} />
          </Layout>
        </Tab>
      </TabView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
});

export default App;