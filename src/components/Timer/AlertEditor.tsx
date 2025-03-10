import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Platform, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Alert, AlertEffect, AlertSoundId } from '../../types/timer';
import { sounds, effects } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertEditor.styles';

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
  const [editedAlert, setEditedAlert] = useState<Alert>(JSON.parse(JSON.stringify(alert)));
  const [modalVisible, setModalVisible] = useState(isVisible);

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

  const handleSave = () => {
    onSave(JSON.parse(JSON.stringify(editedAlert)));
    onClose();
  };

  const isEffectSelected = (effectId: AlertEffect) => {
    return editedAlert.effects.includes(effectId);
  };

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
          </ScrollView>
          
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
        </View>
      </View>
    </Modal>
  );
};