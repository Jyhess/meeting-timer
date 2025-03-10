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
 * Initialise le système audio
 */
export const initAudio = () => {
  console.log('[Audio.web] Initialisation du système audio');
};

/**
 * Récupère l'URL d'un fichier son
 */
export const getSoundUrl = (fileName: SoundName): number => {
  console.log(`[Audio.web] Récupération de l'URL pour le fichier: ${fileName}`);
  return soundMap[fileName];
};

/**
 * Classe de gestion audio
 */
export class Audio {
  private name: SoundName;
  private isPlayingState: boolean = false;
  private audio: HTMLAudioElement;

  constructor(name: SoundName) {
    this.name = name;
    console.log(`[Audio.web] Création d'une instance audio pour: ${name}`);
    
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
  async play(): Promise<void> {
    console.log(`[Audio.web] Lecture de: ${this.name}`);
    try {
      this.audio.currentTime = 0;
      await this.audio.play();
      console.log(`[Audio.web] Lecture réussie de: ${this.name}`);
      this.isPlayingState = true;
    } catch (error) {
      console.error(`[Audio.web] Erreur lors de la lecture de: ${this.name}`, error);
      this.isPlayingState = false;
    }
  }

  /**
   * Met en pause
   */
  pause(): void {
    console.log(`[Audio.web] Pause de: ${this.name}`);
    this.audio.pause();
    this.isPlayingState = false;
  }

  /**
   * Arrête la lecture
   */
  stop(): void {
    console.log(`[Audio.web] Arrêt de: ${this.name}`);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlayingState = false;
  }

  /**
   * Vérifie si l'audio est en cours de lecture
   */
  isPlaying(): boolean {
    console.log(`[Audio.web] Vérification de la lecture pour: ${this.name}`);
    return this.isPlayingState;
  }
} 