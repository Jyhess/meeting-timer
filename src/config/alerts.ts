import { AlertSoundId, AlertEffect } from '../types/timer';

type SoundConfig = {
  id: AlertSoundId;
  name: string;
  icon: string;
};

export type EffectConfig = {
  id: AlertEffect;
  name: string;
  icon: string;
};

export const sounds: SoundConfig[] = [
  {
    id: 'gong',
    name: 'Gong',
    icon: 'gong',
  },
  {
    id: 'bell',
    name: 'Cloche',
    icon: 'notifications',
  },
  {
    id: 'chime',
    name: 'Carillon',
    icon: 'doorbell',
  },
  {
    id: 'alarm',
    name: 'Alarme',
    icon: 'siren',
  },
  /*
  {
    id: 'attention',
    name: 'Attention',
    icon: 'warning',
  },
  {
    id: 'success',
    name: 'Succès',
    icon: 'check_circle',
  },
  {
    id: 'transition',
    name: 'Transition',
    icon: 'change_circle',
  },
  {
    id: 'meditation',
    name: 'Méditation',
    icon: 'self_improvement',
  },
  {
    id: 'flute',
    name: 'Flûte',
    icon: 'music_note',
  },
  {
    id: 'ringing',
    name: 'Sonnerie',
    icon: 'notifications_active',
  },
  {
    id: 'titou',
    name: 'Titou',
    icon: 'celebration',
  },
  {
    id: 'foghorn',
    name: 'Corne de brume',
    icon: 'volume_up',
  },
  {
    id: 'bingbong',
    name: 'Bing Bong',
    icon: 'notifications_active',
  },
  {
    id: 'bigben',
    name: 'Big Ben',
    icon: 'schedule',
  },
  {
    id: 'bell2',
    name: 'Cloche 2',
    icon: 'notifications_active',
  },
  {
    id: 'churchbell',
    name: 'Cloche d\'église',
    icon: 'church',
  },
  */
];

export const effects: EffectConfig[] = [
  {
    id: 'flash',
    name: 'Flash',
    icon: 'flash',
  },
  {
    id: 'shake',
    name: 'Vibration',
    icon: 'vibration',
  },
];