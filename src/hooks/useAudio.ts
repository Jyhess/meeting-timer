import { useRef, useEffect, useState } from 'react';
import { Audio, SoundName } from '../utils/audio';

export const useAudio = () => {  
  const audioRef = useRef<Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
  }


  const playSound = async (sound: SoundName) => {
    console.log(`[useAudio] ▶️ Demande de lecture pour: ${sound}`);
    try {
      setError(null);

      audioRef.current?.stop();
      await audioRef.current ?.play(sound);
      setIsPlaying(true);
      console.log(`[useAudio] ✅ Lecture démarrée pour: ${sound}`);
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('Erreur lors de la lecture du son');
    }
  };

  const stopSound = async () => {
    if (audioRef.current && audioRef.current.isPlaying()) {
      await audioRef.current.stop();
      setIsPlaying(false);
      console.log(`[useAudio] ⏹️ Arrêt effectué`);
    }
  };

  return { isPlaying, playSound, stopSound, error };
};