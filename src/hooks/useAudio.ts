import { useRef, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AlertSound } from '../types/timer';
import { sounds } from '../config/alerts';

export const useAudio = (soundName: AlertSound) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const soundConfig = sounds.find(s => s.id === soundName);
      if (soundConfig) {
        const audio = new Audio(soundConfig.url);
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
        audioRef.current = audio;
      }
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [soundName]);

  const playSound = async () => {
    if (Platform.OS === 'web' && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  const stopSound = () => {
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { playSound, stopSound, isPlaying };
};