import { useRef, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { AlertSound } from '../types/timer';
import { sounds } from '../config/alerts';

export const useAudio = (soundName: AlertSound, customSoundUri?: string) => {
  const soundObjectRef = useRef<Audio.Sound | null>(null);
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
      if (soundObjectRef.current) {
        soundObjectRef.current.unloadAsync().catch(() => {
          // Ignore errors during cleanup
        });
        soundObjectRef.current = null;
      }
    };
  }, []);

  // Preload sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        if (!isMountedRef.current) return;
        
        setError(null);
        setIsLoaded(false);
        
        // Unload previous sound if necessary
        if (soundObjectRef.current) {
          await soundObjectRef.current.unloadAsync().catch(() => {
            // Ignore errors during cleanup
          });
          soundObjectRef.current = null;
        }
        
        let soundSource;
        
        // Si c'est un son personnalisé, utiliser l'URI fourni
        if (soundName === 'custom' && customSoundUri) {
          soundSource = { uri: customSoundUri };
        } else {
          // Sinon, utiliser un son prédéfini
          const soundConfig = sounds.find(s => s.id === soundName);
          if (!soundConfig) {
            throw new Error(`Son non trouvé: ${soundName}`);
          }
          soundSource = soundConfig.url;
        }
        
        // Create and load new sound
        const { sound } = await Audio.Sound.createAsync(
          soundSource,
          { shouldPlay: false },
          (status) => {
            if (!isMountedRef.current) return;
            
            if (status.isLoaded) {
              if (!status.isPlaying && status.didJustFinish) {
                setIsPlaying(false);
              }
            }
          }
        );
        
        if (!isMountedRef.current) {
          // If component unmounted during async operation, clean up the sound
          sound.unloadAsync().catch(() => {
            // Ignore errors during cleanup
          });
          return;
        }
        
        soundObjectRef.current = sound;
        setIsLoaded(true);
      } catch (error) {
        if (!isMountedRef.current) return;
        
        console.error('Error loading sound:', error);
        setError('Impossible de charger le son');
        setIsLoaded(false);
      }
    };
    
    // Only load sound on native platforms or if we're in a web environment that supports Audio
    loadSound();
    
    return () => {
      // Cleanup function when dependencies change
      if (soundObjectRef.current) {
        soundObjectRef.current.unloadAsync().catch(() => {
          // Ignore errors during cleanup
        });
      }
    };
  }, [soundName, customSoundUri]);

  const playSound = async () => {
    try {
      if (!isLoaded) {
        console.log('Le son n\'est pas encore chargé');
        return;
      }
      
      setError(null);
      
      if (soundObjectRef.current) {
        // Make sure sound is at the beginning
        await soundObjectRef.current.setPositionAsync(0);
        await soundObjectRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setError('Erreur lors de la lecture du son');
    }
  };

  const stopSound = async () => {
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync().catch(() => {
          // Ignore errors during stop
        });
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error stopping sound:", error);
      setError('Erreur lors de l\'arrêt du son');
    }
  };

  return { playSound, stopSound, isPlaying, isLoaded, error };
};