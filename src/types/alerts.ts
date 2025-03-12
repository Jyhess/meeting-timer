export type AlertEffect = 'flash' | 'shake';


export type AlertSoundInfo = {
  id: AlertSoundId;
  displayName: string;
  soundKey: string;
  iconName: string;
};

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

export const ALERT_SOUNDS: Record<AlertSoundId, AlertSoundInfo> = {
  bell: {
    id: 'bell',
    displayName: 'Cloche',
    soundKey: 'bell',
    iconName: 'notifications'
  },
  gong: {
    id: 'gong',
    displayName: 'Gong',
    soundKey: 'gong',
    iconName: 'gong'
  },
  alarm: {
    id: 'alarm',
    displayName: 'Alarme',
    soundKey: 'alarm',
    iconName: 'siren'
  },
  chime: {
    id: 'chime',
    displayName: 'Carillon',
    soundKey: 'chime',
    iconName: 'doorbell'
  },
  attention: {
    id: 'attention',
    displayName: 'Attention',
    soundKey: 'attention',
    iconName: 'warning'
  },
  success: {
    id: 'success',
    displayName: 'Succès',
    soundKey: 'success',
    iconName: 'check_circle'
  },
  transition: {
    id: 'transition',
    displayName: 'Transition',
    soundKey: 'transition',
    iconName: 'change_circle'
  },
  meditation: {
    id: 'meditation',
    displayName: 'Méditation',
    soundKey: 'meditation',
    iconName: 'self_improvement'
  },
  flute: {
    id: 'flute',
    displayName: 'Flûte',
    soundKey: 'flute',
    iconName: 'music_note'
  },
  ringing: {
    id: 'ringing',
    displayName: 'Sonnerie',
    soundKey: 'ringing',
    iconName: 'notifications_active'
  },
  titou: {
    id: 'titou',
    displayName: 'Titou',
    soundKey: 'titou',
    iconName: 'celebration'
  },
  foghorn: {
    id: 'foghorn',
    displayName: 'Corne de brume',
    soundKey: 'foghorn',
    iconName: 'volume_up'
  },
  bingbong: {
    id: 'bingbong',
    displayName: 'Bing Bong',
    soundKey: 'bingbong',
    iconName: 'notifications'
  },
  bigben: {
    id: 'bigben',
    displayName: 'Big Ben',
    soundKey: 'bigben',
    iconName: 'schedule'
  },
  bell2: {
    id: 'bell2',
    displayName: 'Cloche 2',
    soundKey: 'bell2',
    iconName: 'notifications_active'
  },
  churchbell: {
    id: 'churchbell',
    displayName: 'Cloche d\'église',
    soundKey: 'churchbell',
    iconName: 'church'
  }
} as const;
