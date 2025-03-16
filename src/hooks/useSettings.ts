import { DEFAULT_SOUNDS } from '../types/sounds';
import { Alert, AlertSoundId, DEFAULT_ALERTS } from '../types/alerts';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_ALERT_DURATION = 5;

interface SettingsState {
  defaultAlerts: Alert[];
  defaultAlertDuration: number;
  availableSounds: AlertSoundId[];
  toggleSound: (soundId: AlertSoundId, enabled: boolean) => void;
  updateDefaultAlert: (alert: Alert) => void;
  setDefaultAlertDuration: (seconds: number) => void;
}

const defaultSettings: Omit<SettingsState, 'toggleSound' | 'updateDefaultAlert' | 'setDefaultAlertDuration'> = {
  defaultAlertDuration: DEFAULT_ALERT_DURATION,
  defaultAlerts: DEFAULT_ALERTS,
  availableSounds: DEFAULT_SOUNDS,
};

// Store Zustand
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleSound: (soundId: AlertSoundId, enabled: boolean) => {
        set((state: SettingsState) => {
          const updatedSounds = enabled
            ? [...state.availableSounds, soundId]
            : state.availableSounds.filter((s) => s !== soundId);

          return { ...state, availableSounds: updatedSounds };
        });
      },

      updateDefaultAlert: (alert: Alert) => {
        set((state: SettingsState) => {
          const updatedAlerts = state.defaultAlerts.map((a) =>
            a.id === alert.id ? { ...a, ...alert } : a
          );

          return { ...state, defaultAlerts: updatedAlerts };
        });
      },

      setDefaultAlertDuration: (seconds: number) => {
        set((state: SettingsState) => ({
          ...state,
          defaultAlertDuration: seconds,
        }));
      },
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);