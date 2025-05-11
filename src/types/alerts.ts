import { SoundId } from './sounds';
import { EffectId } from './effects';


export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: SoundId;
  effects: EffectId[];
};

export const DEFAULT_ALERTS = [
  {
    id: 'before',
    name: 'Bientôt fini',
    enabled: false,
    timeOffset: 0,
    sound: 'bell',
    effects: ['flash', 'shake'] as EffectId[],
  },
  {
    id: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash', 'shake'] as EffectId[],
  },
  {
    id: 'after',
    name: 'Temps dépassé',
    enabled: false,
    timeOffset: 0,
    sound: 'alarm',
    effects: ['flash', 'shake'] as EffectId[],
  },
] as Alert[];
