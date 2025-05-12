import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { SoundId, getSoundConfigs } from '../../types/sounds';
import { TimeInput } from './TimeInput';
import { NameInput } from '../common/NameInput';
import { OptionButton } from '../common/OptionButton';
import { ClickButton } from '../common/ClickButton';
import { ColorButton } from '../common/ColorButton';
import { Section } from '../common/Section';
import { styles } from '../../styles/AlertEditor.styles';
import { theme } from '../../theme';
import { Alert, getAlertTitle, hasAlertTimeOffset, getAlertTimePrefix, AlertType, AlertColor, ALERT_COLORS } from '../../types/alerts';
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

  const handleColorSelect = (color: AlertColor) => {
    setEditedAlert(prev => ({
      ...prev,
      color,
    }));
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

            {hasAlertTimeOffset(alert) && (
              <Section title={t('alerts.type')}>
                <View style={styles.optionsGrid}>
                  <OptionButton
                    id="before"
                    label={t('alerts.before')}
                    isSelected={editedAlert.type === 'before'}
                    onPress={() => handleTypeChange('before')}
                  />
                  <OptionButton
                    id="after"
                    label={t('alerts.after')}
                    isSelected={editedAlert.type === 'after'}
                    onPress={() => handleTypeChange('after')}
                  />
                </View>
              </Section>
            )}

            {hasAlertTimeOffset(alert) && (
              <Section title={t('alerts.timeOffset')}>
                <View style={styles.timeInputContainer}>
                  <TimeInput
                    initialSeconds={editedAlert.timeOffset}
                    onTimeChange={handleTimeChange}
                    timeColor={isValidTime ? theme.colors.white : theme.colors.error}
                    prefix={prefix}
                  />
                </View>
              </Section>
            )}

            <Section title={t('alerts.sound')}>
              {availableSoundConfigs.length === 0 && (
                <Text style={styles.noSoundsText}>
                  {t('alerts.noSoundsAvailable')}
                </Text>
              )}
              <View style={styles.optionsGrid}>
                {availableSoundConfigs.map((sound) => (
                  <OptionButton
                    key={sound.id}
                    id={sound.id}
                    label={t(`sounds.${sound.id}`)}
                    isSelected={editedAlert.sound === sound.id}
                    onPress={() => handleSoundSelect(sound.id)}
                    icon={sound.icon}
                  />
                ))}
              </View>
            </Section>

            <Section title={t('alerts.name')}>
              <NameInput
                value={editedAlert.name}
                onChange={handleNameChange}
                placeholder={t(getAlertTitle(alert))}
                autoFocus
              />
            </Section>

            {hasAlertTimeOffset(alert) && (
              <Section title={t('alerts.color')}>
                <View style={styles.colorGrid}>
                  {ALERT_COLORS.map(hex => (
                    <ColorButton
                      key={hex}
                      hex={hex}
                      isSelected={editedAlert.color === hex}
                      onPress={() => handleColorSelect(hex)}
                    />
                  ))}
                </View>
              </Section>
            )}

          </ScrollView>
          
          <View style={styles.modalButtons}>
            <ClickButton
              label={t('common.delete')}
              onPress={handleDelete}
              variant="danger"
            />
            <ClickButton
              label={t('common.cancel')}
              onPress={onClose}
              variant="default"
            />
            <ClickButton
              label={t('common.save')}
              onPress={handleSave}
              variant="primary"
              disabled={!isValidTime || availableSoundConfigs.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};