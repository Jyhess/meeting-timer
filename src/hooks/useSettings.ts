import { Alert, DEFAULT_ALERTS } from '../types/alerts';
import { SoundId, DEFAULT_SOUNDS } from '../types/sounds';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../locales';

const DEFAULT_ALERT_DURATION = 5;
const DEFAULT_LANGUAGE: Language = 'fr';

interface SettingsState {
  defaultAlerts: Alert[];
  defaultAlertDuration: number;
  availableSounds: SoundId[];
  language: Language;
  toggleSound: (soundId: SoundId, enabled: boolean) => void;
  updateDefaultAlert: (alert: Alert) => void;
  setDefaultAlertDuration: (seconds: number) => void;
  setLanguage: (language: Language) => void;
}

const defaultSettings: Omit<SettingsState, 'toggleSound' | 'updateDefaultAlert' | 'setDefaultAlertDuration' | 'setLanguage'> = {
  defaultAlertDuration: DEFAULT_ALERT_DURATION,
  defaultAlerts: DEFAULT_ALERTS,
  availableSounds: DEFAULT_SOUNDS,
  language: DEFAULT_LANGUAGE,
};

// Store Zustand
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      toggleSound: (soundId: SoundId, enabled: boolean) => {
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

      setLanguage: (language: Language) => {
        set((state: SettingsState) => ({
          ...state,
          language,
        }));
      },
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);