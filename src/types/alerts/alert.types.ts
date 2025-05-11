import { SoundId } from '../sounds';
import { EffectId } from '../effects';

export type AlertType = 'before' | 'end' | 'after';

export type Alert = {
  id: string;
  type: AlertType;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: SoundId;
  effects: EffectId[];
};
