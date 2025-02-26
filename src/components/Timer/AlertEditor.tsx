import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
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
import { Alert, AlertEffect, AlertSound } from '../../types/timer';
import { ToggleSlider } from './ToggleSlider';
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
const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertEditor = ({
  alert,
  isVisible,
  onClose,
  onSave,
}: AlertEditorProps) => {
  const [editedAlert, setEditedAlert] = useState<Alert>(alert);
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [previewingEffect, setPreviewingEffect] = useState<AlertEffect | null>(
    null
  );
  const { playSound, stopSound, isPlaying } = useAudio(editedAlert.sound);

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

    if (previewingEffect === 'pulse') {
      return {
        transform: [
          {
            scale: withRepeat(
              withSequence(
                withTiming(1.2, {
                  duration: 500,
                  easing: Easing.out(Easing.ease),
                }),
                withTiming(1, { duration: 500, easing: Easing.in(Easing.ease) })
              ),
              3
            ),
          },
        ],
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

  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
    }
  }, [isVisible]);

  const handleSoundSelect = (sound: AlertSound) => {
    setEditedAlert((prev) => ({ ...prev, sound }));
  };

  const handleEffectSelect = (effect: AlertEffect) => {
    setEditedAlert((prev) => ({ ...prev, effect }));
    setPreviewingEffect(effect);
    setTimeout(() => {
      setPreviewingEffect(null);
    }, 2000);
  };

  const handleSave = () => {
    if (isPlaying) {
      stopSound();
    }
    onSave(editedAlert);
    onClose();
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
          <Text style={styles.modalTitle}>Configurer l'alerte</Text>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Activer</Text>
            <ToggleSlider
              value={editedAlert.enabled}
              onToggle={(enabled) =>
                setEditedAlert((prev) => ({ ...prev, enabled }))
              }
            />
          </View>

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
                <Pressable style={styles.stopSoundButton} onPress={stopSound}>
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
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Effet</Text>
            <View style={styles.optionsGrid}>
              {effects.map((effect) => (
                <Pressable
                  key={effect.id}
                  style={[
                    styles.optionButton,
                    editedAlert.effect === effect.id &&
                      styles.optionButtonActive,
                  ]}
                  onPress={() => handleEffectSelect(effect.id)}
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
                      color={editedAlert.effect === effect.id ? '#fff' : '#666'}
                    />
                  </AnimatedView>
                  <Text
                    style={[
                      styles.optionText,
                      editedAlert.effect === effect.id &&
                        styles.optionTextActive,
                    ]}
                  >
                    {effect.name}
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
        </AnimatedBlurView>
      </View>
    </Modal>
  );
};
