import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { Alert, AlertEffect, AlertSound } from '../../types/timer';
import { ToggleSlider } from './ToggleSlider';
import { useAudio } from '../../hooks/useAudio';

type AlertEditorProps = {
  alert: Alert;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedAlert: Alert) => void;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AlertEditor = ({ alert, isVisible, onClose, onSave }: AlertEditorProps) => {
  const [editedAlert, setEditedAlert] = useState<Alert>(alert);
  const [modalVisible, setModalVisible] = useState(isVisible);
  const sounds: AlertSound[] = ['gong', 'bell', 'chime'];
  const effects: AlertEffect[] = ['flash', 'pulse', 'shake'];
  const { playSound, stopSound, isPlaying } = useAudio(editedAlert.sound);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isVisible ? 1 : 0.8, {
            damping: 15,
            stiffness: 150
          })
        }
      ],
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.ease)
      })
    };
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
    setEditedAlert(prev => ({ ...prev, sound }));
    playSound();
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
              onToggle={(enabled) => setEditedAlert(prev => ({ ...prev, enabled }))}
            />
          </View>

          {alert.id !== 'end' && (
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>
                {alert.id === 'before' ? 'Minutes avant la fin' : 'Minutes après la fin'}
              </Text>
              <View style={styles.timeOffsetControl}>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setEditedAlert(prev => ({
                    ...prev,
                    timeOffset: Math.max(Math.abs(prev.timeOffset) - 1, 1)
                  }))}
                >
                  <Ionicons name="remove" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.timeOffsetText}>{Math.abs(editedAlert.timeOffset)}</Text>
                <Pressable
                  style={styles.timeButton}
                  onPress={() => setEditedAlert(prev => ({
                    ...prev,
                    timeOffset: Math.min(Math.abs(prev.timeOffset) + 1, 60)
                  }))}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.modalSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son</Text>
              {isPlaying && (
                <Pressable 
                  style={styles.stopSoundButton}
                  onPress={stopSound}
                >
                  <Ionicons 
                    name="volume-mute" 
                    size={20} 
                    color="#fff"
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.optionsGrid}>
              {sounds.map(sound => (
                <Pressable
                  key={sound}
                  style={[
                    styles.optionButton,
                    editedAlert.sound === sound && styles.optionButtonActive
                  ]}
                  onPress={() => handleSoundSelect(sound)}
                >
                  <Ionicons 
                    name={
                      sound === 'gong' ? 'disc-outline' :
                      sound === 'bell' ? 'notifications-outline' :
                      'musical-note-outline'
                    }
                    size={24}
                    color={editedAlert.sound === sound ? '#fff' : '#666'}
                  />
                  <Text style={[
                    styles.optionText,
                    editedAlert.sound === sound && styles.optionTextActive
                  ]}>
                    {sound}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.sectionTitle}>Effet</Text>
            <View style={styles.optionsGrid}>
              {effects.map(effect => (
                <Pressable
                  key={effect}
                  style={[
                    styles.optionButton,
                    editedAlert.effect === effect && styles.optionButtonActive
                  ]}
                  onPress={() => setEditedAlert(prev => ({ ...prev, effect }))}
                >
                  <Ionicons 
                    name={
                      effect === 'flash' ? 'flash-outline' :
                      effect === 'pulse' ? 'radio-outline' :
                      'move-outline'
                    }
                    size={24}
                    color={editedAlert.effect === effect ? '#fff' : '#666'}
                  />
                  <Text style={[
                    styles.optionText,
                    editedAlert.effect === effect && styles.optionTextActive
                  ]}>
                    {effect}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  timeOffsetControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  timeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeOffsetText: {
    fontSize: 20,
    color: '#fff',
    width: 40,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    minWidth: 100,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#666',
    marginTop: 5,
  },
  optionTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stopSoundButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
});