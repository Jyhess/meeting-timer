import { useRef, useState } from 'react';
import { SoundName, soundMap } from '../types/sounds';


export const useAudio = () => {  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [playingSound, setPlayingSound] = useState<SoundName | null>(null);

  if (!audioRef.current) {
    audioRef.current = new window.Audio();
  }

  const playSound = async (sound: SoundName) => {
    console.log(`[useAudio] ▶️ Demande de lecture pour: ${sound}`);
    try {
      if( audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new window.Audio(soundMap[sound]);

          // Configurer les événements
      audio.addEventListener('canplaythrough', () => {
        console.debug(`[Audio.web] Sound ${sound} loaded successfully`);
      });

      audio.addEventListener('error', (error) => {
        console.error(`[Audio.web] Erreur lors du chargement de: ${sound}`, error);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingSound(null);
      });

      audio.addEventListener('loadeddata', () => {
        setSoundDuration(audio.duration);
      });

      audio.play();
      setIsPlaying(true);
      setPlayingSound(sound);
      audioRef.current = audio;
      console.log(`[useAudio] ✅ Playback started for: ${sound}`);
    } catch (error) {
      console.error(`[useAudio] Erreur lors de la lecture de: ${sound}`, error);
    }
  };

  const stopSound = async () => {
    if (audioRef.current && ! audioRef.current?.ended ) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlayingSound(null);
      console.log(`[useAudio] ⏹️ Playback stopped`);
    }
  };

  return { isPlaying, playSound, stopSound, soundDuration, playingSound };
};