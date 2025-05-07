import React, { useState, useRef, useEffect } from 'react';
import { Audio as ExpoAudio, AVPlaybackSource, AVPlaybackStatus } from 'expo-av';
import { soundMap, SoundName } from '../types/sounds';
import { AudioContext } from './AudioContext';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<ExpoAudio.Sound | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [playingSound, setPlayingSound] = useState<SoundName | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      if( ! isInitialized) {
        console.log('[AudioProvider.native] Initializing audio system');
        try {
          await ExpoAudio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          setIsInitialized(true);
          console.log('[AudioProvider.native] Audio system initialized successfully');
        } catch (error) {
          console.error('[AudioProvider.native] Error initializing audio system:', error);
        }
      }
    }
    initAudio();
  }, []);

  const playSound = async (soundName: SoundName) => {
    console.log(`[AudioProvider.native] ▶️ Demande de lecture pour: ${soundName}`);
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
      console.log(`[AudioProvider.native] ✅ Playback started for: ${soundName}`);
    } catch (error) {
      console.error(`[AudioProvider.native] ❌ Erreur lors de la lecture de ${soundName}:`, error);
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
      console.log(`[AudioProvider.native] ⏹️ Playback stopped`);
    }
  };

  return (
    <AudioContext.Provider
      value={{ isPlaying, playSound, stopSound, soundDuration, playingSound }}
    >
      {children}
    </AudioContext.Provider>
  );
};

