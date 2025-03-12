import { useRef, useEffect, useState } from 'react';
import { Audio as ExpoAudio, AVPlaybackSource, AVPlaybackStatus } from 'expo-av';
import { soundMap, SoundName } from '../types/sounds';


class Audio {
  public static isInitialized: boolean = false;

  public static async initAudio(): Promise<void> {
    console.log('[Audio.native] Initialisation du système audio');
    try {
      await ExpoAudio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      Audio.isInitialized = true;
      console.log('[Audio.native] Système audio initialisé avec succès');
    } catch (error) {
      console.error('[Audio.native] Erreur lors de l\'initialisation du système audio:', error);
    }
  };
}


export const useAudio = () => {
  const audioRef = useRef<ExpoAudio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);


  useEffect(() => {
    const initAudio = async () => {
      if( ! Audio.isInitialized) {
        await Audio.initAudio();
      }
    }
    initAudio();
  }, []);
  
  const playSound = async (soundName: SoundName) => {
    console.log(`[useAudio] ▶️ Demande de lecture pour: ${soundName}`);
    try {
      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      }
      const { sound } = await ExpoAudio.Sound.createAsync(
        soundMap[soundName] as AVPlaybackSource,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      audioRef.current = sound;
      await sound.playAsync();

      setIsPlaying(true);
      console.log(`[useAudio] ✅ Lecture démarrée pour: ${soundName}`);
    } catch (error) {
      console.error(`[useAudio] ❌ Erreur lors de la lecture de ${soundName}:`, error);
    }
  };

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if ('isLoaded' in status && status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
      if (status.durationMillis) {
        setSoundDuration(status.durationMillis / 1000);
      }
    }
  }

  const stopSound = async () => {
    if (audioRef.current && isPlaying) {
      await audioRef.current.unloadAsync();
      setIsPlaying(false);
      console.log(`[useAudio] ⏹️ Arrêt effectué`);
    }
  };

  return { isPlaying, playSound, stopSound, soundDuration };
};

