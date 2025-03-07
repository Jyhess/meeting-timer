import React, { useState } from 'react';
import { View, Text, Modal, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { useCustomSounds } from '../../hooks/useCustomSounds';
import { styles } from '../../styles/CustomSoundSelector.styles';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type CustomSoundSelectorProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (uri?: string) => void;
  onAddNew: () => void;
  selectedUri?: string;
};

export const CustomSoundSelector = ({
  isVisible,
  onClose,
  onSelect,
  onAddNew,
  selectedUri,
}: CustomSoundSelectorProps) => {
  const { customSounds, isLoading } = useCustomSounds();
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
    }
  }, [isVisible]);

  const handleSelect = (uri: string) => {
    onSelect(uri);
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
          <View style={styles.header}>
            <Text style={styles.title}>Sons personnalisés</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} color="#eee" />
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Chargement des sons...</Text>
            </View>
          ) : customSounds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="music_note" size={48} color="#888" />
              <Text style={styles.emptyText}>Aucun son personnalisé</Text>
              <Text style={styles.emptySubtext}>
                Ajoutez des sons personnalisés pour les utiliser dans vos alertes
              </Text>
            </View>
          ) : (
            <FlatList
              data={customSounds}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.soundItem,
                    selectedUri === item.uri && styles.soundItemSelected,
                  ]}
                  onPress={() => handleSelect(item.uri)}
                >
                  <View style={styles.soundInfo}>
                    <Icon name="music_note" size={24} color="#aaa" />
                    <Text
                      style={[
                        styles.soundName,
                        selectedUri === item.uri && styles.soundNameSelected,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              )}
              style={styles.soundsList}
            />
          )}

          <Pressable style={styles.addButton} onPress={onAddNew}>
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Ajouter un nouveau son</Text>
          </Pressable>
        </AnimatedBlurView>
      </View>
    </Modal>
  );
};