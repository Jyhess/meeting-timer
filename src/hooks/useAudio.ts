import { useRef, useEffect, useState } from 'react';
import { AlertSound } from '../types/timer';
import { sounds } from '../config/alerts';
import { Audio, initAudio } from '../utils/audio';

// Initialiser le système audio
initAudio();

export const useAudio = (soundName: AlertSound) => {
  const audioRef = useRef<Audio | null>(null);
  const currentSoundRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Set up mount tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
  }, []);

  // Load sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        if (!isMountedRef.current) return;
        
        // Si c'est le même son, pas besoin de le recharger
        if (currentSoundRef.current === soundName) {
          return;
        }
        
        setError(null);
        setIsLoaded(false);
        
        const soundConfig = sounds.find(s => s.id === soundName);
        if (!soundConfig) {
          throw new Error(`Son non trouvé: ${soundName}`);
        }

        // Cleanup previous sound if different
        if (audioRef.current) {
          audioRef.current.stop();
          audioRef.current = null;
        }

        // Créer une nouvelle instance audio
        const audio = new Audio(soundConfig.id);
        audioRef.current = audio;
        currentSoundRef.current = soundName;
        setIsLoaded(true);

      } catch (error) {
        if (!isMountedRef.current) return;
        
        console.error('Error loading sound:', error);
        setError('Impossible de charger le son');
        setIsLoaded(false);
      }
    };
    
    loadSound();
  }, [soundName]);

  const playSound = async () => {
    try {
      if (!isLoaded) {
        console.log('Le son n\'est pas encore chargé');
        return;
      }
      
      setError(null);
      
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('Erreur lors de la lecture du son');
    }
  };

  const stopSound = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.stop();
      }
      setIsPlaying(false);
    } catch (error) {
      console.error("Error stopping sound:", error);
      setError('Erreur lors de l\'arrêt du son');
    }
  };

  return { playSound, stopSound, isPlaying, isLoaded, error };
};