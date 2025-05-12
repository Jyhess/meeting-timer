import { SoundId } from '../sounds';
import { EffectId } from '../effects';

export type AlertType = 'before' | 'end' | 'after';

export const ALERT_COLORS = [
  '#FFA500', // Orange
  '#007AFF', // Bleu
  '#808080', // Gris
  '#000000', // Noir
  '#FFFFFF', // Blanc
  '#FFD700', // Jaune
] as const;

export type AlertColor = typeof ALERT_COLORS[number];

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
