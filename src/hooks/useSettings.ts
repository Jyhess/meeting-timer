import { useEffect, useState } from 'react';
import { DEFAULT_SOUNDS } from '../types/sounds';
import { Alert, AlertSoundId, DEFAULT_ALERTS } from '../types/alerts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const DEFAULT_DURATION = 1800;
const DEFAULT_ALERT_DURATION = 5;

interface SettingsState {
  defaultDurationSeconds: number;
  defaultAlerts: Alert[];
  defaultAlertDuration: number;
  availableSounds: AlertSoundId[];
  toggleSound: (soundId: AlertSoundId, enabled: boolean) => void;
  updateDefaultAlert: (alert: Alert) => void;
  setDefaultDurationSeconds: (seconds: number) => void;
  setDefaultAlertDuration: (seconds: number) => void;
}

const defaultSettings: Omit<SettingsState, 'toggleSound' | 'updateDefaultAlert' | 'setDefaultDurationSeconds' | 'setDefaultAlertDuration'> = {
  defaultDurationSeconds: DEFAULT_DURATION,
  defaultAlertDuration: DEFAULT_ALERT_DURATION,
  defaultAlerts: DEFAULT_ALERTS,
  availableSounds: DEFAULT_SOUNDS,
};

// Fonction utilitaire pour sauvegarder dans MMKV
const storage = new MMKV();
const saveSettings = (settings: SettingsState) => {
  storage.set('appSettings', JSON.stringify(settings));
};

// Store Zustand
export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      toggleSound: (soundId: AlertSoundId, enabled: boolean) => {
        set((state: SettingsState) => {
          const updatedSounds = enabled
            ? [...state.availableSounds, soundId]
            : state.availableSounds.filter((s) => s !== soundId);

          const newState = { ...state, availableSounds: updatedSounds };
          saveSettings(newState);
          return newState;
        });
      },

      updateDefaultAlert: (alert: Alert) => {
        set((state: SettingsState) => {
          const updatedAlerts = state.defaultAlerts.map((a) =>
            a.id === alert.id ? { ...a, ...alert } : a
          );

          const newState = { ...state, defaultAlerts: updatedAlerts };
          saveSettings(newState);
          return newState;
        });
      },

      setDefaultDurationSeconds: (seconds: number) => {
        set((state: SettingsState) => {
          const newState = { ...state, defaultDurationSeconds: seconds };
          saveSettings(newState);
          return newState;
        });
      },

      setDefaultAlertDuration: (seconds: number) => {
        set((state: SettingsState) => {
          const newState = { ...state, defaultAlertDuration: seconds };
          saveSettings(newState);
          return newState;
        });
      },
    }),
    {
      name: 'app-settings',
      getStorage: () => ({
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      }),
    }
  )
);