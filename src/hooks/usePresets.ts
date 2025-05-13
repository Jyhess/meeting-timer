import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerPreset } from '../types/timer';
import { AlertType } from '../types/alerts';

interface PresetsState {
  autoPresets: TimerPreset[];
  bookmarkedPresets: TimerPreset[];
  isLoading: boolean;
  loadPresets: () => Promise<void>;
  createOrUpdatePreset: (seconds: number, alerts: any[], name?: string, color?: string) => Promise<void>;
  updatePreset: (preset: TimerPreset) => Promise<void>;
  removePreset: (presetId: string) => Promise<void>;
  getPreset: (presetId: string) => TimerPreset | undefined;
  reorderBookmarkedPresets: (newOrder: TimerPreset[]) => void;
}

// Handle compatibility with old presets
const handleCompatibility = (presetState: PresetsState) => {
  presetState.autoPresets.forEach(preset => {
    preset.alerts.forEach(alert => {
      if (!alert.type) {
        alert.type = alert.id as AlertType;
      }
    });
  });
  presetState.bookmarkedPresets.forEach(preset => {
    preset.alerts.forEach(alert => {
      if (!alert.type) {
        alert.type = alert.id as AlertType;
      }
    });
  });
};

export const usePresets = create<PresetsState>()(
  persist(
    (set, get) => ({
      autoPresets: [],
      bookmarkedPresets: [],
      isLoading: true,

      loadPresets: async () => {
        set({ isLoading: true });
        try {
          const state = get();
          handleCompatibility(state);
          set({ 
            autoPresets: state.autoPresets,
            bookmarkedPresets: state.bookmarkedPresets,
          });
        } catch (error) {
          console.error('Erreur lors du chargement des presets:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      getPreset: (presetId: string) => {
        const state = get();
        return state.autoPresets.find(p => p.id === presetId) || 
               state.bookmarkedPresets.find(p => p.id === presetId);
      },

      createOrUpdatePreset: async (seconds: number, alerts: any[], name?: string, color?: string) => {
        const now = new Date().toISOString();
        const newPreset: TimerPreset = {
          id: Date.now().toString(),
          name: name ? name : `Timer ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
          seconds,
          alerts,
          created_at: now,
          last_used: now,
          color: color ? color : '',
          bookmarked: name ? true : false,
        };

        const state = get();

        if(newPreset.bookmarked) {
          const newBookmarkedPresets = updateBookmarkedPresets(state.bookmarkedPresets, newPreset);
          set({ bookmarkedPresets: newBookmarkedPresets });
        } else {
          const newAutoPresets = updateAutoPresets(state.autoPresets, newPreset);
          set({ autoPresets: newAutoPresets });
        }
      },

      updatePreset: async (preset: TimerPreset) => {
        const state = get();
        const isInAutoPresets = state.autoPresets.some(p => p.id === preset.id);
        
        if (isInAutoPresets) {
          const newAutoPresets = state.autoPresets.map(p => 
            p.id === preset.id ? { ...preset, last_used: new Date().toISOString() } : p
          );
          set({ autoPresets: newAutoPresets });
        } else {
          const newBookmarkedPresets = state.bookmarkedPresets.map(p => 
            p.id === preset.id ? { ...preset, last_used: new Date().toISOString() } : p
          );
          set({ bookmarkedPresets: newBookmarkedPresets });
        }
      },

      removePreset: async (presetId: string) => {
        const state = get();
        const isInAutoPresets = state.autoPresets.some(p => p.id === presetId);
        
        if (isInAutoPresets) {
          set({
            autoPresets: state.autoPresets.filter(p => p.id !== presetId),
          });
        } else {
          set({
            bookmarkedPresets: state.bookmarkedPresets.filter(p => p.id !== presetId),
          });
        }
      },

      reorderBookmarkedPresets: (newOrder: TimerPreset[]) => {
        set({ bookmarkedPresets: newOrder });
      },
    }),
    {
      name: 'app-presets',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.loadPresets();
      },
    }
  )
); 


function updateBookmarkedPresets(bookmarkedPresets: TimerPreset[], newPreset: TimerPreset) {
  const existingPreset = bookmarkedPresets.find(p => p.name === newPreset.name);
  if (existingPreset) {
    // update the preset without changing order
    const updatedPreset = {
      ...existingPreset,
      ...newPreset,
      ...{ id: existingPreset.id, created_at: existingPreset.created_at }
    };
    const newBookmarkedPresets = bookmarkedPresets.map(p => p.name === newPreset.name ? updatedPreset : p
    );
    return newBookmarkedPresets;
  } else {
    return [newPreset, ...bookmarkedPresets];
  }
}

function updateAutoPresets(autoPresets: TimerPreset[], newPreset: TimerPreset) {
  const existingIndex = autoPresets.findIndex(p => p.seconds === newPreset.seconds &&
    JSON.stringify(p.alerts) === JSON.stringify(newPreset.alerts)
  );
  let newAutoPresets = [...autoPresets];
  if (existingIndex !== -1) {
    newAutoPresets.splice(existingIndex, 1);
  }
  newAutoPresets = [newPreset, ...newAutoPresets].slice(0, 2);

  return newAutoPresets;
}
