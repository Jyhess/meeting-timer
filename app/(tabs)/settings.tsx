import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../src/components/Timer/Icon';
import { IconName } from '../../src/types/icons';
import { useSettings } from '../../src/hooks/useSettings';
import { styles } from '../../src/styles/Settings.styles';
import { theme } from '../../src/theme';
import { sounds } from '../../src/config/alerts';
import { ToggleSlider } from '@/src/components/Timer/ToggleSlider';
import { useAudio } from '@/src/hooks/useAudio';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  const { 
    defaultAlertDuration,
    setDefaultAlertDuration,
    availableSounds,
    toggleSound,
  } = useSettings();
    
  const [alertDuration, setAlertDuration] = useState(defaultAlertDuration.toString());
  const { playSound, stopSound, playingSound } = useAudio();

  useEffect(() => {
    setAlertDuration(defaultAlertDuration.toString());
  }, [defaultAlertDuration]);

  const handleAlertDurationChange = (text: string) => {
    // Accept only numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setAlertDuration(numericValue);
  };

  const handleAlertDurationBlur = () => {
    const numValue = parseInt(alertDuration, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setDefaultAlertDuration(numValue);
    } else {
      // Reset to previous value if invalid
      setAlertDuration(defaultAlertDuration.toString());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Préférences</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Durée des alertes</Text>
            <Text style={styles.sectionDescription}>
              Définissez la durée des alertes (vibrations et effets visuels)
            </Text>
            
            <View style={styles.durationContainer}>
              <View style={styles.durationInputContainer}>
                <TextInput
                  style={styles.durationInput}
                  value={alertDuration}
                  onChangeText={handleAlertDurationChange}
                  onBlur={handleAlertDurationBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationUnit}>secondes</Text>
              </View>
              
              <View style={styles.durationControls}>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.max(1, parseInt(alertDuration, 10) - 1);
                    setAlertDuration(newValue.toString());
                    setDefaultAlertDuration(newValue);
                  }}
                >
                  <Icon name="remove" size={24} color="#eee" />
                </Pressable>
                
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.min(30, parseInt(alertDuration, 10) + 1);
                    setAlertDuration(newValue.toString());
                    setDefaultAlertDuration(newValue);
                  }}
                >
                  <Icon name="add" size={24} color="#eee" />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sons disponibles</Text>
            <Text style={styles.sectionDescription}>
              Choisissez les sons qui seront disponibles pour les alertes
            </Text>
            
            <View style={styles.soundsList}>
              {sounds.map((soundConfig) => (
                <View key={soundConfig.id} style={styles.soundItem}>
                  <View style={styles.soundInfo}>
                    <Icon name={soundConfig.icon as IconName} size={24} color={theme.colors.white} />
                    <Text style={styles.soundName}>{soundConfig.name}</Text>
                  </View>
                  <View style={styles.soundControls}>
                    <ToggleSlider
                      value={availableSounds.includes(soundConfig.id)}
                      onToggle={() => toggleSound(soundConfig.id, !availableSounds.includes(soundConfig.id))}
                    />
                    <Pressable
                      style={styles.playButton}
                      onPress={() => playingSound === soundConfig.id ? stopSound() : playSound(soundConfig.id)}
                    >
                      <Icon
                        name={playingSound === soundConfig.id ? "stop" : "play_arrow" as IconName}
                        size={24}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Link href="/legal" asChild>
              <Pressable style={styles.legalLink}>
                <Text style={styles.legalLinkText}>Informations légales</Text>
                <Icon name="arrow_back" size={24} color="#aaa" style={{ transform: [{ rotate: '180deg' }] }} />
              </Pressable>
            </Link>
          </View>
        </ScrollView>
        
      </LinearGradient>
    </SafeAreaView>
  );
}