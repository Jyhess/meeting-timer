import { useState, useCallback, useEffect } from 'react';
import { TimerPreset } from '../types/timer';
import { PresetManager } from '../utils/PresetManager';

export const usePresets = () => {
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const presetManager = PresetManager.getInstance();

  // Charger les presets au montage initial et écouter les changements
  useEffect(() => {
    const handlePresetsChange = (newPresets: TimerPreset[]) => {
      setPresets(newPresets);
      setIsLoading(false);
    };

    presetManager.addEventListener(handlePresetsChange);
    presetManager.loadPresets();

    return () => {
      presetManager.removeEventListener(handlePresetsChange);
    };
  }, []);

  // Sauvegarder un preset
  const savePreset = useCallback(async (preset: TimerPreset) => {
    await presetManager.savePreset(preset);
  }, []);

  // Supprimer un preset
  const removePreset = useCallback(async (presetId: string) => {
    await presetManager.removePreset(presetId);
  }, []);

  // Rafraîchir les presets
  const refreshPresets = useCallback(() => {
    return presetManager.loadPresets();
  }, []);

  return {
    presets,
    isLoading,
    savePreset,
    removePreset,
    refreshPresets,
  };
}; 