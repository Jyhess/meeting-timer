import { AlertSound, AlertEffect } from '../types/timer';

type SoundConfig = {
  id: AlertSound;
  name: string;
  icon: string;
  url: string;
};

type EffectConfig = {
  id: AlertEffect;
  name: string;
  icon: string;
};

export const sounds: SoundConfig[] = [
  {
    id: 'gong',
    name: 'Gong',
    icon: 'gong',
    url: require('../../assets/sounds/asian-gong.mp3'),
  },
  {
    id: 'bell',
    name: 'Cloche',
    icon: 'notifications',
    url: require('../../assets/sounds/bell-ringing.mp3'),
  },
  {
    id: 'chime',
    name: 'Carillon',
    icon: 'doorbell',
    url: require('../../assets/sounds/chime-and-chomp.mp3'),
  },
  {
    id: 'alarm',
    name: 'Alarme',
    icon: 'siren',
    url: require('../../assets/sounds/alert-sound-loop.mp3'),
  },
];

export const effects: EffectConfig[] = [
  {
    id: 'flash',
    name: 'Flash',
    icon: 'bolt',
  },
  {
    id: 'pulse',
    name: 'Pulsation',
    icon: 'target',
  },
  {
    id: 'shake',
    name: 'Vibration',
    icon: 'vibration',
  },
];
