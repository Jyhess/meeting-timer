import Sound from 'react-native-sound';


/**
 * Initialise le système audio
 */
export const initAudio = () => {
  console.log('[Audio.native] Initialisation du système audio');
  // Activer le mode de débogage en développement
  Sound.setCategory('Playback');
};

/**
 * Récupère l'URL d'un fichier son
 */
export const getSoundUrl = (fileName: string): string => {
  console.log(`[Audio.native] Récupération de l'URL pour le fichier: ${fileName}`);
  return fileName;
};

/**
 * Classe de gestion audio
 */
export class Audio {
  private name: string;
  private isPlayingState: boolean = false;
  private sound: Sound | null = null;

  constructor(name: string) {
    this.name = name;
    console.log(`[Audio.native] Création d'une instance audio pour: ${name}`);
  }

  /**
   * Démarre la lecture
   */
  play(): void {
    console.log(`[Audio.native] Lecture de: ${this.name}`);
    if (this.sound) {
      this.sound.play((success: boolean) => {
        if (!success) {
          console.error(`[Audio.native] Erreur lors de la lecture de: ${this.name}`);
        }
      });
    }
    this.isPlayingState = true;
  }

  /**
   * Met en pause
   */
  pause(): void {
    console.log(`[Audio.native] Pause de: ${this.name}`);
    if (this.sound) {
      this.sound.pause();
    }
    this.isPlayingState = false;
  }

  /**
   * Arrête la lecture
   */
  stop(): void {
    console.log(`[Audio.native] Arrêt de: ${this.name}`);
    if (this.sound) {
      this.sound.stop(() => {
        if (this.sound) {
          this.sound.setCurrentTime(0);
        }
      });
    }
    this.isPlayingState = false;
  }

  /**
   * Vérifie si l'audio est en cours de lecture
   */
  isPlaying(): boolean {
    console.log(`[Audio.native] Vérification de la lecture pour: ${this.name}`);
    return this.isPlayingState;
  }
} 