import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { SoundName, soundMap } from '../types/sounds';
import { AudioContext } from './AudioContext';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [playingSound, setPlayingSound] = useState<SoundName | null>(null);
  
  useEffect(() => {
    if (!audioRef.current) {
      console.log(`[AudioProvider] Creating new audio element`);
      const audio = new Audio();
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingSound(null);
      });

      audio.addEventListener('loadeddata', () => {
        setSoundDuration(audio.duration);
      });

      audio.addEventListener('error', (e) => {
        console.error(`[AudioProvider] Error`, e);
      });
    }
  }, []);

  const playSound = async (sound: SoundName) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!audio.paused) {
        audio.pause();
      }

      if (audio.src !== soundMap[sound]) {
        audio.src = soundMap[sound];
      }

      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
      setPlayingSound(sound);
    } catch (error) {
      console.error(`[AudioProvider] Play error:`, error);
    }
  };

  const stopSound = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setPlayingSound(null);
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

