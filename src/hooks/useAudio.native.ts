import { useRef, useEffect, useState } from 'react';
import { Audio as ExpoAudio, AVPlaybackSource, AVPlaybackStatus } from 'expo-av';
import { soundMap, SoundName } from '../types/sounds';


class Audio {
  public static isInitialized: boolean = false;

  public static async initAudio(): Promise<void> {
    console.log('[Audio.native] Initializing audio system');
    try {
      await ExpoAudio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      Audio.isInitialized = true;
      console.log('[Audio.native] Audio system initialized successfully');
    } catch (error) {
      console.error('[Audio.native] Error initializing audio system:', error);
    }
  };
}


export const useAudio = () => {
  const audioRef = useRef<ExpoAudio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [playingSound, setPlayingSound] = useState<SoundName | null>(null);

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
      setPlayingSound(soundName);
      await sound.playAsync();

      setIsPlaying(true);
      console.log(`[useAudio] ✅ Playback started for: ${soundName}`);
    } catch (error) {
      console.error(`[useAudio] ❌ Erreur lors de la lecture de ${soundName}:`, error);
    }
  };

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if ('isLoaded' in status && status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlayingSound(null);
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
      setPlayingSound(null);
      console.log(`[useAudio] ⏹️ Playback stopped`);
    }
  };

  return { isPlaying, playSound, stopSound, soundDuration, playingSound };
};

