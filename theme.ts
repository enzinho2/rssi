import * as eva from '@eva-design/eva';
import { ThemeType } from '@ui-kitten/components';

export const lightTheme: ThemeType = {
  ...eva.light,
  'color-primary-500': '#5CBD7A',
  'color-primary-700': '#43A862',
  'color-basic-100': '#FFFFFF',
  'color-basic-200': '#F2F2F2',
  'color-basic-800': '#262425',
  'color-basic-1000': '#262425',
};

export const darkTheme: ThemeType = {
  ...eva.dark,
  'color-primary-500': '#5CBD7A',
  'color-primary-700': '#7BD294',
  'color-basic-100': '#262425',
  'color-basic-200': '#363636',
  'color-basic-800': '#FFFFFF',
  'color-basic-1000': '#FFFFFF',
};

export type AppThemeType = 'light' | 'dark';