export type AlertEffect = 'flash' | 'pulse' | 'shake';
export type AlertSound = 'gong' | 'bell' | 'chime';

export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSound;
  effect: AlertEffect;
  lastTriggered?: number;
};