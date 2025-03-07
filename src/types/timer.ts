export type AlertEffect = 'flash' | 'shake';
export type AlertSound = 'gong' | 'bell' | 'chime' | 'alarm' | 'custom';

export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSound;
  effects: AlertEffect[]; // Changé de 'effect' à 'effects' (tableau)
  lastTriggered?: number;
  vibrationDuration?: number; // Durée de vibration en secondes
  effectDuration?: number; // Durée des effets visuels en secondes
  customSoundUri?: string; // URI du son personnalisé
};

export type TimerPreset = {
  id: string;
  name: string;
  minutes: number;
  alerts: Alert[];
  created_at: string;
};

export type CustomSound = {
  id: string;
  name: string;
  uri: string;
  type: string;
};