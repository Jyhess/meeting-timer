import { AlertSoundId, AlertEffect } from '../types/alerts';

type SoundConfig = {
  id: AlertSoundId;
  icon: string;
  source: number;
};

export type EffectConfig = {
  id: AlertEffect;
  icon: string;
};

export const sounds: SoundConfig[] = [
  {
    id: 'gong',
    icon: 'gong',
    source: require('../../assets/sounds/asian-gong.mp3'),
  },
  {
    id: 'bell',
    icon: 'notifications',
    source: require('../../assets/sounds/copper-bell-ding.mp3'),
  },
  {
    id: 'chime',
    icon: 'doorbell',
    source: require('../../assets/sounds/chime-and-chomp.mp3'),
  },
  {
    id: 'alarm',
    icon: 'siren',
    source: require('../../assets/sounds/alert-sound-loop.mp3'),
  },
  {
    id: 'attention',
    icon: 'warning',
    source: require('../../assets/sounds/call-to-attention.mp3'),
  },
  {
    id: 'success',
    icon: 'check_circle',
    source: require('../../assets/sounds/success-fanfare-trumpets.mp3'),
  },
  {
    id: 'transition',
    icon: 'change_circle',
    source: require('../../assets/sounds/vibraphone-transition-music-cue.mp3'),
  },
  {
    id: 'meditation',
    icon: 'self_improvement',
    source: require('../../assets/sounds/deep-meditation.mp3'),
  },
  {
    id: 'flute',
    icon: 'music_note',
    source: require('../../assets/sounds/ambient-flute.mp3'),
  },
  {
    id: 'ringing',
    icon: 'notifications_active',
    source: require('../../assets/sounds/bell-ringing.mp3'),
  },
  {
    id: 'titou',
    icon: 'celebration',
    source: require('../../assets/sounds/titou-titou.mp3'),
  },
  {
    id: 'foghorn',
    icon: 'foggy',
    source: require('../../assets/sounds/fog-horn.mp3'),
  },
  {
    id: 'bingbong',
    icon: 'notifications_active',
    source: require('../../assets/sounds/bingbong.mp3'),
  },
  {
    id: 'bigben',
    icon: 'schedule',
    source: require('../../assets/sounds/big-ben.mp3'),
  },
  {
    id: 'bell2',
    icon: 'church',
    source: require('../../assets/sounds/bell2.mp3'),
  },
  {
    id: 'churchbell',
    icon: 'church',
    source: require('../../assets/sounds/church-bell-dong.mp3'),
  },
];

export const effects: EffectConfig[] = [
  {
    id: 'flash',
    icon: 'flash',
  },
  {
    id: 'shake',
    icon: 'vibration',
  },
];