import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Platform, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { sounds, effects } from '../../config/alerts';
import { Icon } from './Icon';
import { TimeInput } from './TimeInput';
import { styles } from '../../styles/AlertEditor.styles';
import { theme } from '../../theme';
import { Alert, AlertEffect, AlertSoundId } from '../../types/alerts';
import { useSettings } from '../../hooks/useSettings';

type AlertEditorProps = {
  alert: Alert;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedAlert: Alert) => void;
};

export const AlertEditor = ({
  alert,
  isVisible,
  onClose,
  onSave,
}: AlertEditorProps) => {
  const { availableSounds } = useSettings();
  const [editedAlert, setEditedAlert] = useState<Alert>(JSON.parse(JSON.stringify(alert)));
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [isValidTime, setIsValidTime] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      setEditedAlert(JSON.parse(JSON.stringify(alert)));
    } else {
      const timeout = setTimeout(() => {
        setModalVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
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
  };

  const handleTimeChange = (seconds: number, isValid: boolean) => {
    setIsValidTime(isValid);
    if (isValid) {
      setEditedAlert(prev => ({
        ...prev,
        timeOffset: seconds,
      }));
    }
  };

  const handleSave = () => {
    if (isValidTime) {
      editedAlert.enabled = true;
      onSave(JSON.parse(JSON.stringify(editedAlert)));
      onClose();
    }
  };

  const isEffectSelected = (effectId: AlertEffect) => {
    return editedAlert.effects.includes(effectId);
  };

  // Filtrer les sons disponibles
  const availableSoundConfigs = sounds.filter(sound => availableSounds.includes(sound.id));

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{alert.id === 'before'
                    ? 'Alerte avant la fin'
                    : alert.id === 'after'
                    ? 'Alerte après la fin'
                    : 'Alerte à la fin'}</Text>

            {alert.id !== 'end' && (
              <View style={styles.timeInputContainer}>
                <TimeInput
                  initialSeconds={editedAlert.timeOffset}
                  onTimeChange={handleTimeChange}
                  timeColor={isValidTime ? theme.colors.white : theme.colors.error}
                  prefix={alert.id === 'before' ? '-' : '+'}
                  />
              </View>
            )}

            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Son</Text>
                {availableSoundConfigs.length === 0 && (
                  <Text style={styles.noSoundsText}>
                    Aucun son disponible. Activez des sons dans les préférences.
                  </Text>
                )}
              </View>
              <View style={styles.optionsGrid}>
                {availableSoundConfigs.map((sound) => (
                  <TouchableOpacity
                    key={sound.id}
                    style={[
                      styles.optionButton,
                      editedAlert.sound === sound.id && styles.optionButtonActive,
                    ]}
                    onPress={() => handleSoundSelect(sound.id)}
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
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </Pressable>
            <Pressable 
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                (!isValidTime || availableSoundConfigs.length === 0) && styles.modalButtonDisabled
              ]} 
              onPress={handleSave}
              disabled={!isValidTime || availableSoundConfigs.length === 0}
            >
              <Text style={[
                styles.modalButtonText,
                (!isValidTime || availableSoundConfigs.length === 0) && styles.modalButtonTextDisabled
              ]}>
                Enregistrer
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};