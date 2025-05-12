import { SoundId } from '../sounds';
import { EffectId } from '../effects';

export type AlertType = 'before' | 'end' | 'after';

export const ALERT_COLORS = [
  '#FFA500', // Orange
  '#007AFF', // Bleu
  '#FFE700', // Jaune
  '#FF00FF', // Magenta
  '#4ECDC4', // Turquoise
  '#D4A5A5', // Rose poudré
  '#FFFFFF', // Blanc
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
