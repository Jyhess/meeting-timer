import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { Icon } from './Icon';

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
];

interface SavePresetDialogProps {
  isVisible: boolean;
  defaultName: string;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

export function SavePresetDialog({ isVisible, defaultName, onClose, onSave }: SavePresetDialogProps) {
  const [name, setName] = useState(defaultName);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

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
          <Text style={styles.title}>Sauvegarder le timer</Text>
          
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nom du timer"
            placeholderTextColor={theme.colors.gray.medium}
          />

          <Text style={styles.subtitle}>Couleur</Text>
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  color === selectedColor && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.danger} />
            </Pressable>
            <Pressable 
              style={[styles.button, !name.trim() && styles.buttonDisabled]} 
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Icon name="check" size={24} color={theme.colors.primary} />
            </Pressable>
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
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.medium,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.medium,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    justifyContent: 'center',
    marginTop: theme.spacing.small,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.round,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.large,
    marginTop: theme.spacing.large,
  },
  button: {
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    backgroundColor: theme.colors.background.secondary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 