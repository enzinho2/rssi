// types.ts
import * as reactNativeBlePlx from 'react-native-ble-plx';

export interface SavedDevice {
  id: string;
  name: string;
}

export type BLEDevice = reactNativeBlePlx.Device;
