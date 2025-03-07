import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomSound } from '../types/timer';

const CUSTOM_SOUNDS_KEY = 'custom_sounds';

export const useCustomSounds = () => {
  const [customSounds, setCustomSounds] = useState<CustomSound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Set up mount/unmount tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Charger les sons personnalisés au démarrage
  useEffect(() => {
    loadCustomSounds();
  }, []);

  const loadCustomSounds = async () => {
    try {
      setIsLoading(true);
      const storedSounds = await AsyncStorage.getItem(CUSTOM_SOUNDS_KEY);
      
      if (!isMountedRef.current) return;
      
      if (storedSounds) {
        const parsedSounds = JSON.parse(storedSounds);
        
        // Vérifier que les fichiers existent toujours
        const validSounds = await Promise.all(
          parsedSounds.map(async (sound: CustomSound) => {
            if (!isMountedRef.current) return null;
            
            if (sound.uri.startsWith('file://')) {
              try {
                const fileInfo = await FileSystem.getInfoAsync(sound.uri);
                return fileInfo.exists ? sound : null;
              } catch (error) {
                console.error('Erreur lors de la vérification du fichier:', error);
                return null;
              }
            }
            return sound;
          })
        );
        
        if (!isMountedRef.current) return;
        
        setCustomSounds(validSounds.filter(Boolean));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des sons personnalisés:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const saveCustomSounds = async (sounds: CustomSound[]) => {
    try {
      await AsyncStorage.setItem(CUSTOM_SOUNDS_KEY, JSON.stringify(sounds));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sons personnalisés:', error);
    }
  };

  const addCustomSound = async (sound: CustomSound) => {
    const updatedSounds = [...customSounds, sound];
    setCustomSounds(updatedSounds);
    await saveCustomSounds(updatedSounds);
  };

  const removeCustomSound = async (soundId: string) => {
    const soundToRemove = customSounds.find(s => s.id === soundId);
    
    // Si le son est stocké localement, supprimer le fichier
    if (soundToRemove && soundToRemove.uri.startsWith('file://') && Platform.OS !== 'web') {
      try {
        await FileSystem.deleteAsync(soundToRemove.uri, { idempotent: true });
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
      }
    }
    
    const updatedSounds = customSounds.filter(s => s.id !== soundId);
    setCustomSounds(updatedSounds);
    await saveCustomSounds(updatedSounds);
  };

  const pickAudioFile = async (): Promise<CustomSound | null> => {
    try {
      // Vérifier les permissions pour la bibliothèque multimédia sur iOS
      if (Platform.OS === 'ios') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission refusée pour accéder à la bibliothèque multimédia');
          return null;
        }
      }
      
      // Ouvrir le sélecteur de documents
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      
      if (!isMountedRef.current) return null;
      
      if (result.canceled) {
        return null;
      }
      
      const asset = result.assets[0];
      
      // Créer un ID unique pour le son
      const soundId = Date.now().toString();
      
      // Créer un nom lisible à partir du nom de fichier
      const fileName = asset.name || 'Son personnalisé';
      const displayName = fileName.replace(/\.[^/.]+$/, ""); // Enlever l'extension
      
      // Sur les plateformes mobiles, copier le fichier dans le répertoire de l'application
      let finalUri = asset.uri;
      
      if (Platform.OS !== 'web' && FileSystem.documentDirectory) {
        const newUri = FileSystem.documentDirectory + `sounds/${soundId}_${fileName}`;
        
        // Créer le dossier sounds s'il n'existe pas
        const soundsDir = FileSystem.documentDirectory + 'sounds';
        const dirInfo = await FileSystem.getInfoAsync(soundsDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(soundsDir, { intermediates: true });
        }
        
        // Copier le fichier
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newUri
        });
        
        finalUri = newUri;
      }
      
      if (!isMountedRef.current) {
        // If component unmounted, clean up the file we just created
        if (Platform.OS !== 'web' && finalUri !== asset.uri) {
          try {
            await FileSystem.deleteAsync(finalUri, { idempotent: true });
          } catch (error) {
            // Ignore cleanup errors
          }
        }
        return null;
      }
      
      const newSound: CustomSound = {
        id: soundId,
        name: displayName,
        uri: finalUri,
        type: asset.mimeType || 'audio/mpeg'
      };
      
      await addCustomSound(newSound);
      return newSound;
      
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier audio:', error);
      return null;
    }
  };

  return {
    customSounds,
    isLoading,
    loadCustomSounds,
    addCustomSound,
    removeCustomSound,
    pickAudioFile
  };
};