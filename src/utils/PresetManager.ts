import { TimerPreset } from '../types/timer';
import { loadPresets as loadPresetsFromStorage, savePresets as savePresetsToStorage } from '../lib/storage';

export class PresetManager {
  private static instance: PresetManager;
  private presets: TimerPreset[] = [];
  private listeners: Set<(presets: TimerPreset[]) => void> = new Set();

  private constructor() {}

  static getInstance(): PresetManager {
    if (!PresetManager.instance) {
      PresetManager.instance = new PresetManager();
    }
    return PresetManager.instance;
  }

  // Charger les presets depuis le stockage
  async loadPresets(): Promise<TimerPreset[]> {
    try {
      this.presets = await loadPresetsFromStorage();
      this.notifyListeners();
      return this.presets;
    } catch (error) {
      console.error('Erreur lors du chargement des presets:', error);
      return [];
    }
  }

  // Sauvegarder un preset
  async savePreset(preset: TimerPreset): Promise<void> {
    const now = new Date().toISOString();
    const updatedPreset = {
      ...preset,
      last_used: now
    };

    // Supprimer le preset existant s'il existe
    const existingPresetIndex = this.presets.findIndex(p => p.id === updatedPreset.id);
    let newPresets = [...this.presets];
    
    if (existingPresetIndex !== -1) {
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

    try {
      await savePresetsToStorage(newPresets);
      this.presets = newPresets;
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du preset:', error);
    }
  }

  // Créer un nouveau preset
  async createPreset(seconds: number, alerts: any[]): Promise<void> {
    const now = new Date().toISOString();
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name: `Timer ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
      seconds,
      alerts,
      created_at: now,
      last_used: now,
    };
    const existingPreset = this.findSimilarPreset(newPreset);
    if (existingPreset) {
      await this.savePreset(existingPreset);
    } else {
      await this.savePreset(newPreset);
    }
  }

  // Supprimer un preset
  async removePreset(presetId: string): Promise<void> {
    const newPresets = this.presets.filter(p => p.id !== presetId);
    try {
      await savePresetsToStorage(newPresets);
      this.presets = newPresets;
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur lors de la suppression du preset:', error);
    }
  }

  // Obtenir tous les presets
  getPresets(): TimerPreset[] {
    return this.presets;
  }

  getPreset(presetId: string): TimerPreset | undefined {
    return this.presets.find(p => p.id === presetId);
  }

  // Trouver un preset similaire
  findSimilarPreset(preset: TimerPreset): TimerPreset | undefined {
    return this.presets.find(p => 
      p.seconds === preset.seconds && 
      JSON.stringify(p.alerts) === JSON.stringify(preset.alerts)
    );
  }

  // Gestion des listeners
  addEventListener(callback: (presets: TimerPreset[]) => void): void {
    this.listeners.add(callback);
  }

  removeEventListener(callback: (presets: TimerPreset[]) => void): void {
    this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.presets));
  }
} 