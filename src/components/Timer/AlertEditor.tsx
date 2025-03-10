import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Vibration, Platform, ScrollView, TouchableOpacity } from 'react-native';
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
import { Alert, AlertEffect, AlertSoundId } from '../../types/timer';
import { useAudio } from '../../hooks/useAudio';
import { sounds, effects } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertEditor.styles';

type AlertEditorProps = {
  alert: Alert;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedAlert: Alert) => void;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AlertEditor = ({
  alert,
  isVisible,
  onClose,
  onSave,
}: AlertEditorProps) => {
  // Créer une copie profonde de l'alerte pour éviter les références partagées
  const [editedAlert, setEditedAlert] = useState<Alert>(JSON.parse(JSON.stringify(alert)));
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [previewingEffect, setPreviewingEffect] = useState<AlertEffect | null>(null);
  const { stopSound, isPlaying } = useAudio(editedAlert.sound);

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

  // Réinitialiser l'état édité à chaque ouverture du modal
  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      // Créer une copie profonde de l'alerte pour éviter les références partagées
      setEditedAlert(JSON.parse(JSON.stringify(alert)));
    }
  }, [isVisible, alert]);

  const handleSoundSelect = (soundId: AlertSoundId) => {
    setEditedAlert(prev => ({
      ...prev,
      sound: soundId,
    }));
  };

  const handleEffectToggle = (effectId: AlertEffect) => {
    setEditedAlert(prev => {
      const newEffects = prev.effects.includes(effectId)
        ? prev.effects.filter(e => e !== effectId)
        : [...prev.effects, effectId];

      return {
        ...prev,
        effects: newEffects,
      };
    });
    
    setPreviewingEffect(effectId);
    
    if (effectId === 'shake' && Platform.OS !== 'web') {
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
        
    onSave(JSON.parse(JSON.stringify(editedAlert)));
    onClose();
  };

  const isEffectSelected = (effectId: AlertEffect) => {
    return editedAlert.effects.includes(effectId);
  };

  const getSoundName = () => {
    const soundConfig = sounds.find(s => s.id === editedAlert.sound);
    return soundConfig ? soundConfig.name : "Son inconnu";
  };

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
                    <Icon name="volume_off" size={20} color="#fff" />
                  </Pressable>
                )}
              </View>
              <View style={styles.optionsGrid}>
                {sounds.map((sound) => (
                  <TouchableOpacity
                    key={sound.id}
                    style={[
                      styles.optionButton,
                      editedAlert.sound === sound.id && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSoundSelect(sound.id as AlertSoundId)}
                  >
                    <Icon 
                      name={sound?.icon as any}
                      size={28}
                      color={'#fff'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        editedAlert.sound === sound.id && styles.optionTextActive,
                      ]}
                    >
                      {sound.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>Effets</Text>
              <View style={styles.optionsGrid}>
                {effects.map((effect) => (
                  <TouchableOpacity
                    key={effect.id}
                    style={[
                      styles.optionButton,
                      isEffectSelected(effect.id as AlertEffect) && styles.optionButtonActive,
                    ]}
                    onPress={() => handleEffectToggle(effect.id as AlertEffect)}
                  >
                    <Icon
                      name={effect.icon as any}
                      size={24}
                      color={isEffectSelected(effect.id as AlertEffect) ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isEffectSelected(effect.id as AlertEffect) && styles.optionTextActive,
                      ]}
                    >
                      {effect.name}
                      {effect.id === 'shake' && Platform.OS !== 'web' && (
                        <Text style={styles.effectNote}> (+ vibration)</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={onClose}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </AnimatedBlurView>
      </View>
    </Modal>
  );
};