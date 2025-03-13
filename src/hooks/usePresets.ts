import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { TimerPreset } from '../types/timer';

interface PresetsState {
  presets: TimerPreset[];
  isLoading: boolean;
  loadPresets: () => Promise<void>;
  savePreset: (preset: TimerPreset) => Promise<void>;
  createPreset: (seconds: number, alerts: any[]) => Promise<void>;
  removePreset: (presetId: string) => Promise<void>;
  getPreset: (presetId: string) => TimerPreset | undefined;
  refreshPresets: () => Promise<void>;
}

const storage = new MMKV();

export const usePresets = create<PresetsState>()(
  persist(
    (set, get) => ({
      presets: [],
      isLoading: true,

      loadPresets: async () => {
        try {
          const storedPresets = storage.getString('presets');
          const presets = storedPresets ? JSON.parse(storedPresets) : [];
          set({ presets, isLoading: false });
        } catch (error) {
          console.error('Erreur lors du chargement des presets:', error);
          set({ presets: [], isLoading: false });
        }
      },

      refreshPresets: async () => {
        await get().loadPresets();
      },

      getPreset: (presetId: string) => {
        const state = get();
        return state.presets.find(p => p.id === presetId);
      },

      savePreset: async (preset: TimerPreset) => {
        const now = new Date().toISOString();
        const updatedPreset = {
          ...preset,
          last_used: now
        };

        const state = get();
        const existingPresetIndex = state.presets.findIndex(p => p.id === updatedPreset.id);
        let newPresets = [...state.presets];
        
        if (existingPresetIndex !== -1) {
          newPresets.splice(existingPresetIndex, 1);
        }

        newPresets = [updatedPreset, ...newPresets]
          .sort((a, b) => {
            const aDate = a.last_used || a.created_at;
            const bDate = b.last_used || b.created_at;
            return new Date(bDate).getTime() - new Date(aDate).getTime();
          })
          .slice(0, 6);

        storage.set('presets', JSON.stringify(newPresets));
        set({ presets: newPresets });
      },

      createPreset: async (seconds: number, alerts: any[]) => {
        const now = new Date().toISOString();
        const newPreset: TimerPreset = {
          id: Date.now().toString(),
          name: `Timer ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
          seconds,
          alerts,
          created_at: now,
          last_used: now,
        };

        const state = get();
        const existingPreset = state.presets.find(p => 
          p.seconds === newPreset.seconds && 
          JSON.stringify(p.alerts) === JSON.stringify(newPreset.alerts)
        );

        if (existingPreset) {
          await get().savePreset(existingPreset);
        } else {
          await get().savePreset(newPreset);
        }
      },

      removePreset: async (presetId: string) => {
        const state = get();
        const newPresets = state.presets.filter(p => p.id !== presetId);
        storage.set('presets', JSON.stringify(newPresets));
        set({ presets: newPresets });
      },
    }),
    {
      name: 'app-presets',
      storage: {
        getItem: (key) => {
          const value = storage.getString(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => storage.set(key, JSON.stringify(value)),
        removeItem: (key) => storage.delete(key),
      },
    }
  )
); 