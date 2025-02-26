import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type SavePresetModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  minutes: number;
};

export const SavePresetModal = ({
  isVisible,
  onClose,
  onSave,
  minutes,
}: SavePresetModalProps) => {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(isVisible);

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

  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      setName(`Timer ${minutes}min`);
    }
  }, [isVisible, minutes]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
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
          onAnimatedValueUpdate={() => {
            if (!isVisible) {
              setModalVisible(false);
            }
          }}
        >
          <Text style={styles.modalTitle}>Sauvegarder la configuration</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom de la configuration</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Présentation 30min"
              placeholderTextColor="#666"
              autoFocus
            />
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
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
});
