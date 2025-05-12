import { SoundId } from '../sounds';
import { EffectId } from '../effects';

export type AlertType = 'before' | 'end' | 'after';

export const ALERT_COLORS = {
  orange: '#FFA500',
  blue: '#007AFF',
  gray: '#808080',
  black: '#000000',
  white: '#FFFFFF',
  yellow: '#FFD700',
} as const;

export type AlertColor = keyof typeof ALERT_COLORS;

export interface Alert {
  id: string;
  type: AlertType;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: SoundId;
  effects: EffectId[];
  color?: AlertColor;
}
