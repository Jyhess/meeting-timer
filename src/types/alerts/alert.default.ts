import { Alert } from './alert.types';
import { EffectId } from '../effects';

export const DEFAULT_ALERTS = [
  {
    id: 'end',
    type: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash', 'shake'] as EffectId[],
  },
] as Alert[];
