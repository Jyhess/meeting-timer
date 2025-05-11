import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Platform, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SoundId, getSoundConfigs } from '../../types/sounds';
import { effects, EffectId } from '../../types/effects';
import { Icon } from './Icon';
import { TimeInput } from './TimeInput';
import { NameInput } from '../common/NameInput';
import { styles } from '../../styles/AlertEditor.styles';
import { theme } from '../../theme';
import { Alert, getAlertTitle, hasAlertTimeOffset, getAlertTimePrefix, AlertType } from '../../types/alerts';
import { useSettings } from '../../hooks/useSettings';
import { useTranslation } from '../../hooks/useTranslation';

type AlertEditorProps = {
  alert: Alert;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedAlert: Alert) => void;
  onDelete: () => void;
};

export const AlertEditor = ({
  alert,
  isVisible,
  onClose,
  onSave,
  onDelete,
}: AlertEditorProps) => {
  const { t } = useTranslation();
  const { availableSounds } = useSettings();
  const [editedAlert, setEditedAlert] = useState<Alert>(JSON.parse(JSON.stringify(alert)));
  const [modalVisible, setModalVisible] = useState(isVisible);
  const [isValidTime, setIsValidTime] = useState(true);
  const [prefix, setPrefix] = useState(getAlertTimePrefix(alert));

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

  const handleSoundSelect = (soundId: SoundId) => {
    setEditedAlert(prev => ({
      ...prev,
      sound: soundId,
    }));
  };

  const handleEffectToggle = (effectId: EffectId) => {
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

  const handleNameChange = (text: string) => {
    setEditedAlert(prev => ({
      ...prev,
      name: text,
    }));
  };

  const handleTypeChange = (type: AlertType) => {
    const newAlert = {
      ...editedAlert,
      type: type,
    };
    setEditedAlert(newAlert);
    setPrefix(getAlertTimePrefix(newAlert));
  };

  const handleSave = () => {
    if (isValidTime) {
      editedAlert.enabled = true;
      onSave(JSON.parse(JSON.stringify(editedAlert)));
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const isEffectSelected = (effectId: EffectId) => {
    return editedAlert.effects.includes(effectId);
  };

  // Filtrer les sons disponibles
  const availableSoundConfigs = getSoundConfigs()
    .filter(sound => availableSounds.includes(sound.id));

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
            <Text style={styles.modalTitle}>{t(getAlertTitle(alert))}</Text>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>{t('alerts.type')}</Text>
              <View style={styles.optionsGrid}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    editedAlert.type === 'before' && styles.optionButtonActive,
                  ]}
                  onPress={() => handleTypeChange('before')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      editedAlert.type === 'before' && styles.optionTextActive,
                    ]}
                  >
                    {t('alerts.before')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    editedAlert.type === 'after' && styles.optionButtonActive,
                  ]}
                  onPress={() => handleTypeChange('after')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      editedAlert.type === 'after' && styles.optionTextActive,
                    ]}
                  >
                    {t('alerts.after')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>{t('alerts.name')}</Text>
              <NameInput
                value={editedAlert.name}
                onChange={handleNameChange}
                placeholder={t(getAlertTitle(alert))}
                autoFocus
              />
            </View>

            {hasAlertTimeOffset(alert) && (
              <View style={styles.timeInputContainer}>
                <TimeInput
                  initialSeconds={editedAlert.timeOffset}
                  onTimeChange={handleTimeChange}
                  timeColor={isValidTime ? theme.colors.white : theme.colors.error}
                  prefix={prefix}
                  />
              </View>
            )}

            <View style={styles.modalSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('alerts.sound')}</Text>
                {availableSoundConfigs.length === 0 && (
                  <Text style={styles.noSoundsText}>
                    {t('alerts.noSoundsAvailable')}
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
                      name={sound.icon as any}
                      size={28}
                      color={'#fff'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        editedAlert.sound === sound.id && styles.optionTextActive,
                      ]}
                    >
                      {t(`sounds.${sound.id}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>{t('alerts.effects')}</Text>
              <View style={styles.optionsGrid}>
                {Object.entries(effects).map(([id, config]) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.optionButton,
                      isEffectSelected(id as EffectId) && styles.optionButtonActive,
                    ]}
                    onPress={() => handleEffectToggle(id as EffectId)}
                  >
                    <Icon
                      name={config.icon as any}
                      size={24}
                      color={isEffectSelected(id as EffectId) ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isEffectSelected(id as EffectId) && styles.optionTextActive,
                      ]}
                    >
                      {t(`effects.${id}`)}
                      {id === 'shake' && Platform.OS !== 'web' && (
                        <Text style={styles.effectNote}> (+ vibration)</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.modalButton, styles.modalButtonDanger]} 
              onPress={handleDelete}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextDanger]}>
                {t('common.delete')}
              </Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
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
                {t('common.save')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};