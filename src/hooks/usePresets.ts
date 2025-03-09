import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerPreset } from '../types/timer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@timer_presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Charger les presets depuis le stockage
  const loadPresets = useCallback(async () => {
    try {
      const storedPresets = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPresets && isMountedRef.current) {
        setPresets(JSON.parse(storedPresets));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des presets:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Sauvegarder les presets
  const savePresets = useCallback(async (newPresets: TimerPreset[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
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

  // Effet de montage/démontage
  useEffect(() => {
    loadPresets();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPresets]);

  return {
    presets,
    isLoading,
    addPreset,
    removePreset,
    refreshPresets,
  };
}; 