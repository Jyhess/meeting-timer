import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerPreset } from '../types/timer';
import { loadPresets as loadPresetsFromStorage, savePresets as savePresetsToStorage } from '../lib/storage';

export const usePresets = () => {
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Charger les presets depuis le stockage
  const loadPresets = useCallback(async () => {
    try {
      const storedPresets = await loadPresetsFromStorage();
      if (isMountedRef.current) {
        setPresets(storedPresets);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des presets:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Charger les presets au montage initial
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  // Sauvegarder les presets
  const savePresets = useCallback(async (newPresets: TimerPreset[]) => {
    try {
      await savePresetsToStorage(newPresets);
      if (isMountedRef.current) {
        setPresets(newPresets);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des presets:', error);
    }
  }, []);

  // Ajouter un preset
  const addPreset = useCallback(async (preset: TimerPreset) => {
    const newPresets = [preset, ...presets].slice(0, 6); // Garder les 6 plus récents
    await savePresets(newPresets);
  }, [presets, savePresets]);

  // Supprimer un preset
  const removePreset = useCallback(async (presetId: string) => {
    const newPresets = presets.filter(p => p.id !== presetId);
    await savePresets(newPresets);
  }, [presets, savePresets]);

  // Rafraîchir les presets
  const refreshPresets = useCallback(() => {
    return loadPresets();
  }, [loadPresets]);

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    presets,
    isLoading,
    addPreset,
    removePreset,
    refreshPresets,
  };
}; 