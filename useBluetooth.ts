// useBluetooth.ts
import { useState, useEffect, useRef } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Define an interface for saved devices.
export interface SavedDevice {
  id: string;
  name: string;
}

export const useBluetooth = () => {
  const bleManager = useRef(new BleManager()).current;
  const [devices, setDevices] = useState<Device[]>([]);
  const [trackingDevice, setTrackingDevice] = useState<Device | null>(null);
  const [rssi, setRssi] = useState<number | null>(null);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const [savedDevices, setSavedDevices] = useState<SavedDevice[]>([]);

  // Request necessary permissions for Android.
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

  useEffect(() => {
    requestBluetoothPermissions();

    // Cleanup the BleManager on unmount.
    return () => {
      bleManager.destroy();
    };
  }, [bleManager]);

  // Start scanning for devices.
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
    // Stop scanning after 10 seconds.
    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 10000);
  };

  // Select a device and start tracking its RSSI.
  const startTracking = async (device: Device) => {
    setTrackingDevice(device);
    setRssi(null);

    try {
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      // Use device name if available; otherwise, fallback to device.id.
      console.log(`Connected to ${connectedDevice.name || connectedDevice.id}`);

      // Start an interval to read RSSI every second.
      trackingInterval.current = setInterval(async () => {
        try {
          const updatedDevice = await connectedDevice.readRSSI();
          const rssiValue = updatedDevice.rssi;
          setRssi(rssiValue);
          console.log(`RSSI: ${rssiValue}`);
        } catch (error) {
          console.error('Error reading RSSI:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // Stop tracking RSSI and disconnect.
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
  };

  // Save a device with a custom name.
  // If no custom name is provided, fall back to device.name or device.id.
  const saveDevice = (device: Device, customName?: string) => {
    const nameToSave = customName || device.name || device.id;
    setSavedDevices((prev) => {
      const deviceExists = prev.find((d) => d.id === device.id);
      if (deviceExists) {
        // Update the device name if it already exists.
        return prev.map((d) =>
          d.id === device.id ? { id: device.id, name: nameToSave } : d
        );
      } else {
        return [...prev, { id: device.id, name: nameToSave }];
      }
    });
  };

  // Connect to a saved device.
  // Since saved devices only have id and name, we create a minimal Device object.
  const connectToSavedDevice = async (savedDevice: SavedDevice) => {
    const dummyDevice = { id: savedDevice.id, name: savedDevice.name } as Device;
    await startTracking(dummyDevice);
  };

  return {
    devices,
    trackingDevice,
    rssi,
    startScan,
    startTracking,
    stopTracking,
    savedDevices,
    saveDevice,
    connectToSavedDevice,
  };
};
