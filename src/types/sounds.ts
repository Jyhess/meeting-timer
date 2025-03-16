// Map des sons disponibles
export const soundMap = {
    bell: require('../../assets/sounds/copper-bell-ding.mp3'),
    gong: require('../../assets/sounds/asian-gong.mp3'),
    alarm: require('../../assets/sounds/alert-sound-loop.mp3'),
    attention: require('../../assets/sounds/call-to-attention.mp3'),
    success: require('../../assets/sounds/success-fanfare-trumpets.mp3'),
    transition: require('../../assets/sounds/vibraphone-transition-music-cue.mp3'),
    meditation: require('../../assets/sounds/deep-meditation.mp3'),
    chime: require('../../assets/sounds/chime-and-chomp.mp3'),
    flute: require('../../assets/sounds/ambient-flute.mp3'),
    ringing: require('../../assets/sounds/bell-ringing.mp3'),
    titou: require('../../assets/sounds/titou-titou.mp3'),
    foghorn: require('../../assets/sounds/fog-horn.mp3'),
    bingbong: require('../../assets/sounds/bingbong.mp3'),
    bigben: require('../../assets/sounds/big-ben.mp3'),
    bell2: require('../../assets/sounds/bell2.mp3'),
    churchbell: require('../../assets/sounds/church-bell-dong.mp3'),
  } as const;
  
export type SoundName = keyof typeof soundMap;
