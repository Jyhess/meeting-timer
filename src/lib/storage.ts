import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { TimerPreset } from '../types/timer';
import { Settings } from '../hooks/useSettings';

const PRESETS_KEY = 'timer_presets';
const SETTINGS_KEY = 'timer_settings';

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
    const presetsJson = await storage.getItem(PRESETS_KEY);
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
    await storage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving presets:', error);
  }
};

export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const settingsJson = await storage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return null;
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};