import { AlertEffect } from "./alerts";
import { AlertSoundId } from './alerts';


export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSoundId;
  effects: AlertEffect[];
  effectDuration?: number;
};

export type TimerPreset = {
  id: string;
  name: string;
  seconds: number;
  alerts: Alert[];
  created_at: string;
  last_used?: string;
};

export type CustomSound = {
  id: string;
  name: string;
  uri: string;
  type: string;
};
