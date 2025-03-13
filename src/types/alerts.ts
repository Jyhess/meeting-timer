export type AlertEffect = 'flash' | 'shake';

export type AlertSoundId = 
  | 'bell'
  | 'gong'
  | 'chime'
  | 'alarm'
  | 'attention'
  | 'success'
  | 'transition'
  | 'meditation'
  | 'flute'
  | 'ringing'
  | 'titou'
  | 'foghorn'
  | 'bingbong'
  | 'bigben'
  | 'bell2'
  | 'churchbell';

export type Alert = {
  id: string;
  name: string;
  enabled: boolean;
  timeOffset: number;
  sound: AlertSoundId;
  effects: AlertEffect[];
};

export const DEFAULT_ALERTS = [
  {
    id: 'before',
    name: 'Bientôt fini',
    enabled: true,
    timeOffset: 5,
    sound: 'bell',
      effects: ['flash'] as AlertEffect[],
  },
  {
    id: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash'] as AlertEffect[],
  },
  {
    id: 'after',
    name: 'Temps dépassé',
    enabled: true,
    timeOffset: 5,
    sound: 'alarm',
    effects: ['shake'] as AlertEffect[],
  },
] as Alert[];
