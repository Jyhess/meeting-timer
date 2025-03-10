import { Audio as ExpoAudio } from 'expo-av';
import { SoundName } from './audio';

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

/**
 * Initialise le système audio
 */
export const initAudio = async () => {
  console.log('[Audio.native] Initialisation du système audio');
  await ExpoAudio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
  });
};

/**
 * Récupère l'URL d'un fichier son
 */
export const getSoundUrl = (fileName: SoundName): number => {
  console.log(`[Audio.native] Récupération de l'URL pour le fichier: ${fileName}`);
  return soundMap[fileName];
};

/**
 * Classe de gestion audio
 */
export class Audio {
  private name: SoundName;
  private isPlayingState: boolean = false;
  private sound: ExpoAudio.Sound | null = null;

  constructor(name: SoundName) {
    this.name = name;
    console.log(`[Audio.native] Création d'une instance audio pour: ${name}`);
  }

  /**
   * Charge le son
   */
  private async loadSound(): Promise<void> {
    if (!this.sound) {
      console.log(`[Audio.native] Chargement du son: ${this.name}`);
      const { sound } = await ExpoAudio.Sound.createAsync(
        getSoundUrl(this.name),
        { shouldPlay: false }
      );
      this.sound = sound;
      
      // Configurer les événements
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          this.isPlayingState = status.isPlaying;
        }
      });
    }
  }

  /**
   * Démarre la lecture
   */
  async play(): Promise<void> {
    console.log(`[Audio.native] Lecture de: ${this.name}`);
    try {
      await this.loadSound();
      if (this.sound) {
        await this.sound.setPositionAsync(0);
        await this.sound.playAsync();
        console.log(`[Audio.native] Lecture réussie de: ${this.name}`);
      }
    } catch (error) {
      console.error(`[Audio.native] Erreur lors de la lecture de: ${this.name}`, error);
      this.isPlayingState = false;
    }
  }

  /**
   * Met en pause
   */
  async pause(): Promise<void> {
    console.log(`[Audio.native] Pause de: ${this.name}`);
    if (this.sound) {
      await this.sound.pauseAsync();
    }
  }

  /**
   * Arrête la lecture
   */
  async stop(): Promise<void> {
    console.log(`[Audio.native] Arrêt de: ${this.name}`);
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  /**
   * Vérifie si l'audio est en cours de lecture
   */
  isPlaying(): boolean {
    return this.isPlayingState;
  }
} 