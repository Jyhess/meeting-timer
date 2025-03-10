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
  const savePreset = useCallback(async (preset: TimerPreset) => {
    console.log('[usePresets] addPreset', preset);
    // Supprimer le preset existant s'il existe
    const updatedPreset = {
      ...preset,
      last_used: new Date().toISOString()
    };
    const existingPresetIndex = presets.findIndex(p => p.id === updatedPreset.id);
    let newPresets = [...presets];
    
    if (existingPresetIndex !== -1) {
      console.log('[usePresets] Suppression du preset existant', existingPresetIndex);
      // supprimer le preset existant et le remplacer par le nouveau
      newPresets.splice(existingPresetIndex, 1);
    }
    // Ajouter le nouveau preset et trier par last_used
    newPresets = [updatedPreset, ...newPresets]
      .sort((a, b) => {
        const aDate = a.last_used || a.created_at;
        const bDate = b.last_used || b.created_at;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, 6); // Garder les 6 plus récents
      
    console.log('[usePresets] newPresets', newPresets);
    
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
    savePreset,
    removePreset,
    refreshPresets,
  };
}; 