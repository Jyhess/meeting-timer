// Map des sons disponibles
const soundMap = {
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

/**
 * Récupère l'URL d'un fichier son
 */
export const getSoundUrl = (fileName: SoundName): string => {
  console.log(`[Audio.web] Récupération de l'URL pour le fichier: ${fileName}`);
  return soundMap[fileName];
};

/**
 * Classe de gestion audio
 */
export class Audio {
  private isPlayingState: boolean = false;
  private audio?: HTMLAudioElement;

  constructor() {
    console.log('[Audio.web] Initialisation du système audio');
  }

  async loadAudio(name: SoundName): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    // Créer l'élément audio
    const audio = new window.Audio(getSoundUrl(name));
      
      // Configurer les événements
    audio.addEventListener('canplaythrough', () => {
      console.debug(`[Audio.web] Son ${name} chargé avec succès`);
    });

    audio.addEventListener('error', (error) => {
      console.error(`[Audio.web] Erreur lors du chargement de: ${name}`, error);
    });

    audio.addEventListener('ended', () => {
      this.isPlayingState = false;
    });

    // Stocker l'instance
    this.audio = audio;
  }

  /**
   * Démarre la lecture
   */
  async play(name: SoundName): Promise<void> {
    console.log(`[Audio.web] Lecture de: ${name}`);
    try {
      await this.loadAudio(name);
      await this.audio?.play();
      console.log(`[Audio.web] Lecture réussie de: ${name}`);
      this.isPlayingState = true;
    } catch (error) {
      console.error(`[Audio.web] Erreur lors de la lecture de: ${name}`, error);
      this.isPlayingState = false;
    }
  }

  /**
   * Met en pause
   */
  async pause(): Promise<void> {
    console.log(`[Audio.web] Pause`);
    this.audio?.pause();
    this.isPlayingState = false;
  }

  /**
   * Arrête la lecture
   */
  async stop(): Promise<void> {
    console.log(`[Audio.web] Arrêt`);
    this.audio?.pause();
    this.isPlayingState = false;
  }

  /**
   * Vérifie si l'audio est en cours de lecture
   */
  isPlaying(): boolean {
    if (this.audio) {
      console.log(`[Audio.web] Vérification de la lecture : ${this.isPlayingState}`);
      return this.isPlayingState;
    }
    return false;
  }
} 