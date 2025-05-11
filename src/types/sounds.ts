export const sounds = {
  gong: {
    icon: 'gong',
    source: require('../../assets/sounds/asian-gong.mp3'),
  },
  bell: {
    icon: 'notifications',
    source: require('../../assets/sounds/copper-bell-ding.mp3'),
  },
  chime: {
    icon: 'doorbell',
    source: require('../../assets/sounds/chime-and-chomp.mp3'),
  },
  alarm: {
    icon: 'siren',
    source: require('../../assets/sounds/alert-sound-loop.mp3'),
  },
  attention: {
    icon: 'warning',
    source: require('../../assets/sounds/call-to-attention.mp3'),
  },
  success: {
    icon: 'check_circle',
    source: require('../../assets/sounds/success-fanfare-trumpets.mp3'),
  },
  transition: {
    icon: 'change_circle',
    source: require('../../assets/sounds/vibraphone-transition-music-cue.mp3'),
  },
  meditation: {
    icon: 'self_improvement',
    source: require('../../assets/sounds/deep-meditation.mp3'),
  },
  flute: {
    icon: 'music_note',
    source: require('../../assets/sounds/ambient-flute.mp3'),
  },
  ringing: {
    icon: 'notifications_active',
    source: require('../../assets/sounds/bell-ringing.mp3'),
  },
  titou: {
    icon: 'celebration',
    source: require('../../assets/sounds/titou-titou.mp3'),
  },
  foghorn: {
    icon: 'foggy',
    source: require('../../assets/sounds/fog-horn.mp3'),
  },
  bingbong: {
    icon: 'notifications_active',
    source: require('../../assets/sounds/bingbong.mp3'),
  },
  bigben: {
    icon: 'schedule',
    source: require('../../assets/sounds/big-ben.mp3'),
  },
  bell2: {
    icon: 'church',
    source: require('../../assets/sounds/bell2.mp3'),
  },
  churchbell: {
    icon: 'church',
    source: require('../../assets/sounds/church-bell-dong.mp3'),
  },
} as const;

export type SoundId = keyof typeof sounds;

export const DEFAULT_SOUNDS = [
  'bell',
  'gong',
  'alarm',
] as SoundId[];

export const getSoundConfigs = () => 
  Object.entries(sounds).map(([id, config]) => ({ 
    id: id as SoundId, 
    ...config 
  }));
