export type AlertEffect = 'flash' | 'shake';
export type AlertSound = 'bell' | 'gong' | 'chime' | 'alarm' | 'attention' | 'success' | 'transition' | 'meditation' | 'flute' | 'ringing' | 'titou' | 'foghorn' | 'bingbong' | 'bigben' | 'bell2' | 'churchbell';

export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSound;
  effects: AlertEffect[];
  lastTriggered?: number;
  vibrationDuration?: number;
  effectDuration?: number;
};

export type TimerPreset = {
  id: string;
  name: string;
  seconds: number;
  alerts: Alert[];
  created_at: string;
};

export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export type CustomSound = {
  id: string;
  name: string;
  uri: string;
  type: string;
};
