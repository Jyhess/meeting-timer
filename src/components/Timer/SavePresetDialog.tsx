import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { NameInput } from '../common/NameInput';
import { useTranslation } from '../../hooks/useTranslation';
import { ClickButton } from '../common/ClickButton';
import { ColorButton } from '../common/ColorButton';

const PRESET_COLORS = [
  '#FF6B6B', // Rouge
  '#4ECDC4', // Turquoise
  '#45B7D1', // Bleu clair
  '#96CEB4', // Vert menthe
  '#FFEEAD', // Jaune pâle
  '#D4A5A5', // Rose poudré
  '#9B59B6', // Violet
  '#3498DB', // Bleu
  '#2ECC71', // Vert
  '#F1C40F', // Jaune
  '#E67E22', // Orange
  '#1ABC9C', // Turquoise foncé
];

interface SavePresetDialogProps {
  isVisible: boolean;
  defaultName: string;
  defaultColor?: string;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

export function SavePresetDialog({ isVisible, defaultName, defaultColor, onClose, onSave }: SavePresetDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(defaultName);
  const [selectedColor, setSelectedColor] = useState(defaultColor || PRESET_COLORS[0]);

  useEffect(() => {
    setName(defaultName);
    if (defaultColor) {
      setSelectedColor(defaultColor);
    }
  }, [defaultName, defaultColor]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('preset.saveTitle')}</Text>
          
          <NameInput
            value={name}
            onChange={setName}
            placeholder={t('preset.namePlaceholder')}
            autoFocus
          />

          <Text style={styles.subtitle}>{t('preset.color')}</Text>
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map(hex => (
              <ColorButton
                key={hex}
                hex={hex}
                isSelected={hex === selectedColor}
                onPress={() => setSelectedColor(hex)}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <ClickButton
              label={t('common.cancel')}
              variant="danger"
              onPress={onClose}
            />
            <ClickButton
              label={t('common.save')}
              variant="primary"
              onPress={handleSave}
              disabled={!name.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borders.radius.large,
    padding: theme.spacing.large,
    width: Math.min(screenWidth - 20, 500),
    maxWidth: 400,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.white,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    justifyContent: 'center',
    marginTop: theme.spacing.small,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.large,
    marginTop: theme.spacing.large,
  },
}); 