import { useRef, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AlertSound } from '../types/timer';

export const useAudio = (soundName: AlertSound) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const audio = new Audio(
        soundName === 'gong' 
          ? 'https://assets.mixkit.co/active_storage/sfx/2424/2424-preview.mp3'
          : soundName === 'bell'
          ? 'https://assets.mixkit.co/active_storage/sfx/2400/2400-preview.mp3'
          : 'https://assets.mixkit.co/active_storage/sfx/2399/2399-preview.mp3'
      );
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current = audio;
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