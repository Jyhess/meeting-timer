import { Alert } from './alert.types';
import { EffectId } from '../effects';

export const DEFAULT_ALERTS = [
  {
    id: 'before',
    type: 'before',
    name: 'Bientôt fini',
    enabled: false,
    timeOffset: 0,
    sound: 'bell',
    effects: ['flash', 'shake'] as EffectId[],
  },
  {
    id: 'end',
    type: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash', 'shake'] as EffectId[],
  },
  {
    id: 'after',
    type: 'after',
    name: 'Temps dépassé',
    enabled: false,
    timeOffset: 0,
    sound: 'alarm',
    effects: ['flash', 'shake'] as EffectId[],
  },
] as Alert[];
