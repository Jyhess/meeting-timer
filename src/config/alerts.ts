import { AlertSound, AlertEffect } from '../types/timer';
import { getSoundUrl } from '../utils/audio';

type SoundConfig = {
  id: AlertSound;
  name: string;
  icon: string;
  url: string;
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
    url: getSoundUrl('asian-gong.mp3'),
  },
  {
    id: 'bell',
    name: 'Cloche',
    icon: 'notifications',
    url: getSoundUrl('bell-ringing.mp3'),
  },
  {
    id: 'chime',
    name: 'Carillon',
    icon: 'doorbell',
    url: getSoundUrl('chime-and-chomp.mp3'),
  },
  {
    id: 'alarm',
    name: 'Alarme',
    icon: 'siren',
    url: getSoundUrl('alert-sound-loop.mp3'),
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