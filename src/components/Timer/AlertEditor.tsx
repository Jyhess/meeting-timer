import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Vibration, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Alert, AlertEffect, AlertSound } from '../../types/timer';
import { useAudio } from '../../hooks/useAudio';
import { sounds, effects } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertEditor.styles';
import { useSettings } from '../../hooks/useSettings';
import { useCustomSounds } from '../../hooks/useCustomSounds';
import { CustomSoundSelector } from './CustomSoundSelector';

type AlertEditorProps = {
  alert: Alert;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedAlert: Alert) => void;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertEditor = ({
  alert,
  isVisible,
  onClose,
  onSave,
}: AlertEditorProps) => {
  // Créer une copie profonde de l'alerte pour éviter les références partagées
  const [editedAlert, setEditedAlert] = useState<Alert>(JSON.parse(JSON.stringify(alert)));
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [previewingEffect, setPreviewingEffect] = useState<AlertEffect | null>(
    null
  );
  const [showCustomSoundSelector, setShowCustomSoundSelector] = useState(false);
  const { playSound, stopSound, isPlaying } = useAudio(
    editedAlert.sound, 
    editedAlert.customSoundUri
  );
  const { defaultAlertDuration } = useSettings();
  const { customSounds } = useCustomSounds();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isVisible ? 1 : 0.8, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const previewAnimatedStyle = useAnimatedStyle(() => {
    if (!previewingEffect) return {};

    if (previewingEffect === 'flash') {
      return {
        opacity: withRepeat(
          withSequence(
            withTiming(0.3, { duration: 250 }),
            withTiming(1, { duration: 250 })
          ),
          3
        ),
      };
    }

    if (previewingEffect === 'shake') {
      return {
        transform: [
          {
            translateX: withRepeat(
              withSequence(
                withTiming(-5, { duration: 100 }),
                withTiming(5, { duration: 100 }),
                withTiming(0, { duration: 100 })
              ),
              3
            ),
          },
        ],
      };
    }

    return {};
  });

  const handleModalHide = () => {
    if (!isVisible) {
      runOnJS(setModalVisible)(false);
    }
  };

  // Réinitialiser l'état édité à chaque ouverture du modal
  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      // Créer une copie profonde de l'alerte pour éviter les références partagées
      setEditedAlert(JSON.parse(JSON.stringify(alert)));
    }
  }, [isVisible, alert]);

  const handleSoundSelect = (sound: AlertSound) => {
    if (sound === 'custom') {
      if (Platform.OS !== 'web' && customSounds.length > 0) {
        setShowCustomSoundSelector(true);
      } else if (Platform.OS !== 'web' && customSounds.length === 0) {
        // Informer l'utilisateur qu'il doit d'abord ajouter des sons personnalisés dans les paramètres
        console.log('Aucun son personnalisé disponible. Ajoutez-en dans les paramètres.');
      } else {
        // Sur le web, ne pas permettre la sélection de sons personnalisés
        console.log('Sons personnalisés non disponibles sur le web');
      }
    } else {
      setEditedAlert((prev) => ({ 
        ...prev, 
        sound,
        // Si on sélectionne un son prédéfini, supprimer l'URI du son personnalisé
        customSoundUri: undefined
      }));
    }
  };

  const handleCustomSoundSelect = async (customSoundUri?: string) => {
    setShowCustomSoundSelector(false);
    
    if (customSoundUri) {
      setEditedAlert((prev) => ({ 
        ...prev, 
        sound: 'custom',
        customSoundUri
      }));
    }
  };

  const handleEffectToggle = (effect: AlertEffect) => {
    setEditedAlert((prev) => {
      // Vérifier si l'effet est déjà dans le tableau
      const effectIndex = prev.effects.indexOf(effect);
      let newEffects: AlertEffect[];
      
      if (effectIndex !== -1) {
        // Si l'effet est déjà présent, le retirer
        newEffects = [...prev.effects];
        newEffects.splice(effectIndex, 1);
      } else {
        // Sinon, l'ajouter
        newEffects = [...prev.effects, effect];
      }
      
      return { ...prev, effects: newEffects };
    });
    
    // Prévisualiser l'effet
    setPreviewingEffect(effect);
    
    // Prévisualiser l'effet de vibration sur les appareils mobiles
    if (effect === 'shake' && Platform.OS !== 'web') {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Vibration.vibrate(300);
      }
    }
    
    setTimeout(() => {
      setPreviewingEffect(null);
    }, 2000);
  };

  const handleSave = () => {
    if (isPlaying) {
      stopSound();
    }
    
    // S'assurer que les durées sont correctement définies
    const finalAlert = {
      ...editedAlert,
      vibrationDuration: editedAlert.effects.includes('shake') ? 
        (defaultAlertDuration || 5) : undefined,
      // Utiliser les durées des paramètres
      effectDuration: editedAlert.effects.includes('flash') ? 
        (defaultAlertDuration || 5) : undefined
    };
    
    // Appeler onSave avec une copie profonde pour éviter les références partagées
    onSave(JSON.parse(JSON.stringify(finalAlert)));
    onClose();
  };

  const isEffectSelected = (effect: AlertEffect) => {
    return editedAlert.effects.includes(effect);
  };

  // Obtenir le nom du son personnalisé à partir de l'URI
  const getCustomSoundName = () => {
    if (!editedAlert.customSoundUri) return "Son personnalisé";
    
    const customSound = customSounds.find(s => s.uri === editedAlert.customSoundUri);
    if (customSound) return customSound.name;
    
    // Extraire le nom du fichier de l'URI
    const uriParts = editedAlert.customSoundUri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    
    // Enlever l'extension et les caractères spéciaux
    return fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  };

  // Vérifier si l'option "custom" doit être affichée
  const shouldShowCustomOption = Platform.OS !== 'web' && customSounds.length > 0;

  // Fonction pour arrêter le son et l'effet de prévisualisation
  const handleStopAll = () => {
    stopSound();
    setPreviewingEffect(null);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <AnimatedBlurView
          intensity={50}
          style={[styles.modalContent, animatedStyle]}
          onAnimatedValueUpdate={handleModalHide}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Configurer l'alerte</Text>

            {alert.id !== 'end' && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>
                  {alert.id === 'before'
                    ? 'Minutes avant la fin'
                    : 'Minutes après la fin'}
                </Text>
                <View style={styles.timeOffsetControl}>
                  <Pressable
                    style={styles.timeButton}
                    onPress={() =>
                      setEditedAlert((prev) => ({
                        ...prev,
                        timeOffset: Math.max(Math.abs(prev.timeOffset) - 1, 1),
                      }))
                    }
                  >
                    <Icon name="remove" size={24} color="#fff" />
                  </Pressable>
                  <Text style={styles.timeOffsetText}>
                    {Math.abs(editedAlert.timeOffset)}
                  </Text>
                  <Pressable
                    style={styles.timeButton}
                    onPress={() =>
                      setEditedAlert((prev) => ({
                        ...prev,
                        timeOffset: Math.min(Math.abs(prev.timeOffset) + 1, 60),
                      }))
                    }
                  >
                    <Icon name="add" size={24} color="#fff" />
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Son</Text>
                {isPlaying && (
                  <Pressable style={styles.stopSoundButton} onPress={handleStopAll}>
                    <Icon name="volume-off" size={20} color="#fff" />
                  </Pressable>
                )}
              </View>
              <View style={styles.optionsGrid}>
                {sounds.map((sound) => (
                  <Pressable
                    key={sound.id}
                    style={[
                      styles.optionButton,
                      editedAlert.sound === sound.id && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSoundSelect(sound.id)}
                  >
                    <Icon
                      name={sound.icon as any}
                      size={24}
                      color={editedAlert.sound === sound.id ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        editedAlert.sound === sound.id && styles.optionTextActive,
                      ]}
                    >
                      {sound.name}
                    </Text>
                    <Pressable style={styles.playButton} onPress={playSound}>
                      <Icon
                        name="play-circle"
                        size={20}
                        color={editedAlert.sound === sound.id ? '#fff' : '#666'}
                      />
                    </Pressable>
                  </Pressable>
                ))}
                
                {/* Option pour son personnalisé - uniquement sur mobile et si des sons personnalisés existent */}
                {shouldShowCustomOption && (
                  <Pressable
                    style={[
                      styles.optionButton,
                      editedAlert.sound === 'custom' && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSoundSelect('custom')}
                  >
                    <Icon
                      name="music_note"
                      size={24}
                      color={editedAlert.sound === 'custom' ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        editedAlert.sound === 'custom' && styles.optionTextActive,
                      ]}
                    >
                      {editedAlert.sound === 'custom' ? getCustomSoundName() : 'Personnalisé'}
                    </Text>
                    {editedAlert.sound === 'custom' && editedAlert.customSoundUri && (
                      <Pressable style={styles.playButton} onPress={playSound}>
                        <Icon
                          name="play-circle"
                          size={20}
                          color="#fff"
                        />
                      </Pressable>
                    )}
                  </Pressable>
                )}
                
                {/* Message informatif si aucun son personnalisé n'est disponible */}
                {Platform.OS !== 'web' && customSounds.length === 0 && (
                  <View style={styles.infoMessage}>
                    <Text style={styles.infoMessageText}>
                      Pour utiliser des sons personnalisés, ajoutez-les d'abord dans les paramètres.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Effets</Text>
              <View style={styles.optionsGrid}>
                {effects.map((effect) => (
                  <Pressable
                    key={effect.id}
                    style={[
                      styles.optionButton,
                      isEffectSelected(effect.id) && styles.optionButtonActive,
                    ]}
                    onPress={() => handleEffectToggle(effect.id)}
                  >
                    <AnimatedView
                      style={[
                        styles.effectIconContainer,
                        previewingEffect === effect.id && previewAnimatedStyle,
                      ]}
                    >
                      <Icon
                        name={effect.icon as any}
                        size={24}
                        color={isEffectSelected(effect.id) ? '#fff' : '#666'}
                      />
                    </AnimatedView>
                    <Text
                      style={[
                        styles.optionText,
                        isEffectSelected(effect.id) && styles.optionTextActive,
                      ]}
                    >
                      {effect.name}
                      {effect.id === 'shake' && Platform.OS !== 'web' && (
                        <Text style={styles.effectNote}> (+ vibration)</Text>
                      )}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </Pressable>
            </View>
          </ScrollView>
        </AnimatedBlurView>
        
        {showCustomSoundSelector && Platform.OS !== 'web' && (
          <CustomSoundSelector
            isVisible={showCustomSoundSelector}
            onClose={() => setShowCustomSoundSelector(false)}
            onSelect={handleCustomSoundSelect}
            onAddNew={() => {
              // Fermer le sélecteur sans ajouter de nouveau son
              setShowCustomSoundSelector(false);
            }}
            selectedUri={editedAlert.customSoundUri}
          />
        )}
      </View>
    </Modal>
  );
};