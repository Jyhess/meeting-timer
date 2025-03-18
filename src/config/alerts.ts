import { AlertSoundId, AlertEffect } from '../types/alerts';

type SoundConfig = {
  id: AlertSoundId;
  name: string;
  icon: string;
  source: number;
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
    source: require('../../assets/sounds/asian-gong.mp3'),
  },
  {
    id: 'bell',
    name: 'Cloche',
    icon: 'notifications',
    source: require('../../assets/sounds/copper-bell-ding.mp3'),
  },
  {
    id: 'chime',
    name: 'Carillon',
    icon: 'doorbell',
    source: require('../../assets/sounds/chime-and-chomp.mp3'),
  },
  {
    id: 'alarm',
    name: 'Alarme',
    icon: 'siren',
    source: require('../../assets/sounds/alert-sound-loop.mp3'),
  },
  {
    id: 'attention',
    name: 'Attention',
    icon: 'warning',
    source: require('../../assets/sounds/call-to-attention.mp3'),
  },
  {
    id: 'success',
    name: 'Succès',
    icon: 'check_circle',
    source: require('../../assets/sounds/success-fanfare-trumpets.mp3'),
  },
  {
    id: 'transition',
    name: 'Transition',
    icon: 'change_circle',
    source: require('../../assets/sounds/vibraphone-transition-music-cue.mp3'),
  },
  {
    id: 'meditation',
    name: 'Méditation',
    icon: 'self_improvement',
    source: require('../../assets/sounds/deep-meditation.mp3'),
  },
  {
    id: 'flute',
    name: 'Flûte',
    icon: 'music_note',
    source: require('../../assets/sounds/ambient-flute.mp3'),
  },
  {
    id: 'ringing',
    name: 'Sonnerie',
    icon: 'notifications_active',
    source: require('../../assets/sounds/bell-ringing.mp3'),
  },
  {
    id: 'titou',
    name: 'Titou',
    icon: 'celebration',
    source: require('../../assets/sounds/titou-titou.mp3'),
  },
  {
    id: 'foghorn',
    name: 'Corne de brume',
    icon: 'foggy',
    source: require('../../assets/sounds/fog-horn.mp3'),
  },
  {
    id: 'bingbong',
    name: 'Bing Bong',
    icon: 'notifications_active',
    source: require('../../assets/sounds/bingbong.mp3'),
  },
  {
    id: 'bigben',
    name: 'Big Ben',
    icon: 'schedule',
    source: require('../../assets/sounds/big-ben.mp3'),
  },
  {
    id: 'bell2',
    name: 'Cloche 2',
    icon: 'church',
    source: require('../../assets/sounds/bell2.mp3'),
  },
  {
    id: 'churchbell',
    name: 'Cloche d\'église',
    icon: 'church',
    source: require('../../assets/sounds/church-bell-dong.mp3'),
  },
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