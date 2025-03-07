import React, { useState } from 'react';
import {
  View,
  Text,
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
import { styles } from '../../styles/SavePresetModal.styles';

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