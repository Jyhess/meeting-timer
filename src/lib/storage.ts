import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { TimerPreset } from '../types/timer';

const STORAGE_KEY = 'timer_presets';

const webStorage = {
  getItem: (key: string) => {
    const value = window.localStorage.getItem(key);
    return Promise.resolve(value);
  },
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
};

const storage = Platform.select({
  web: webStorage,
  default: AsyncStorage,
});

if (!storage) {
  throw new Error('No storage implementation available');
}

export const loadPresets = async (): Promise<TimerPreset[]> => {
  try {
    const presetsJson = await storage.getItem(STORAGE_KEY);
    if (presetsJson) {
      return JSON.parse(presetsJson);
    }
  } catch (error) {
    console.error('Error loading presets:', error);
  }
  return [];
};

export const savePresets = async (presets: TimerPreset[]): Promise<void> => {
  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving presets:', error);
  }
};