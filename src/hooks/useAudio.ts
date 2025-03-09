import { useRef, useEffect, useState } from 'react';
import { Audio, SoundName } from '../utils/audio';

export const useAudio = (sound: SoundName) => {
  // console.log(`[useAudio] 🎵 Initialisation du hook pour le son: ${sound}`);
  
  const audioRef = useRef<Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Set up mount tracking
  useEffect(() => {
    console.log(`[useAudio] 🔄 Effect déclenché pour le son: ${sound}`);
    isMountedRef.current = true;
    return () => {
      console.log(`[useAudio] 🧹 Nettoyage de l'effet pour le son: ${sound}`);
      isMountedRef.current = false;
    };
  }, [sound]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        console.log(`[useAudio] 🧹 Nettoyage de l'instance audio pour: ${sound}`);
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
  }, [sound]);

  // Load sound
  useEffect(() => {
    try {
      if (!isMountedRef.current) return;

      // Cleanup previous sound if different
      if (audioRef.current) {
        console.log(`[useAudio] 🧹 Nettoyage de l'instance audio précédente pour: ${sound}`);
        audioRef.current.stop();
        audioRef.current = null;
      }

      // Créer une nouvelle instance audio
      console.log(`[useAudio] 🎼 Création d'une nouvelle instance Audio pour: ${sound}`);
      audioRef.current = new Audio(sound);
      setError(null);

    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error('Error loading sound:', error);
      setError('Impossible de charger le son');
    }
  }, [sound]);

  const playSound = async () => {
    console.log(`[useAudio] ▶️ Demande de lecture pour: ${sound}`);
    try {
      setError(null);
      
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log(`[useAudio] ✅ Lecture démarrée pour: ${sound}`);
      } else {
        console.warn(`[useAudio] ⚠️ Tentative de lecture sans instance audio pour: ${sound}`);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('Erreur lors de la lecture du son');
    }
  };

  const stopSound = () => {
    console.log(`[useAudio] ⏹️ Demande d'arrêt pour: ${sound}`);
    if (audioRef.current) {
      audioRef.current.stop();
      setIsPlaying(false);
      console.log(`[useAudio] ✅ Arrêt effectué pour: ${sound}`);
    } else {
      console.warn(`[useAudio] ⚠️ Tentative d'arrêt sans instance audio pour: ${sound}`);
    }
  };

  return { isPlaying, playSound, stopSound, error };
};