import { AlertSound, AlertEffect } from '../types/timer';

type SoundConfig = {
  id: AlertSound;
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
    icon: 'celebration',
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
    icon: 'ring_volume',
  },
  {
    id: 'titou',
    name: 'Titou',
    icon: 'pets',
  },
  {
    id: 'foghorn',
    name: 'Corne de brume',
    icon: 'foggy',
  },
  {
    id: 'bingbong',
    name: 'Bing Bong',
    icon: 'notifications_active',
  },
  {
    id: 'bigben',
    name: 'Big Ben',
    icon: 'watch',
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