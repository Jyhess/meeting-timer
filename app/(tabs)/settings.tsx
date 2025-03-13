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
import { Icon, IconName } from '../../src/components/Timer/Icon';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { Alert } from '../../src/types/timer';
import { useSettings } from '../../src/hooks/useSettings';
import { styles } from '../../src/styles/Settings.styles';
import { formatTimeFromSeconds } from '../../src/utils/time';
import { TimeInput } from '../../src/components/Timer/TimeInput';
import { theme } from '../../src/theme';
import { sounds } from '../../src/config/alerts';
import { AlertSoundId } from '../../src/types/alerts';
import { ToggleSlider } from '@/src/components/Timer/ToggleSlider';
import { useAudio } from '@/src/hooks/useAudio';

export default function SettingsScreen() {
  const { 
    defaultDurationSeconds, 
    setDefaultDurationSeconds,
    defaultAlerts,
    defaultAlertDuration,
    setDefaultAlertDuration,
    updateDefaultAlert,
    availableSounds,
    toggleSound,
  } = useSettings();
    
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [alertDuration, setAlertDuration] = useState(defaultAlertDuration.toString());
  const [editingDuration, setEditingDuration] = useState(false);
  const { playSound, stopSound, playingSound } = useAudio();

  
  useEffect(() => {
    setAlertDuration(defaultAlertDuration.toString());
  }, [defaultAlertDuration]);

  const handleAlertDurationChange = (text: string) => {
    // Accepter uniquement les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    setAlertDuration(numericValue);
  };

  const handleAlertDurationBlur = () => {
    const numValue = parseInt(alertDuration, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setDefaultAlertDuration(numValue);
    } else {
      // Réinitialiser à la valeur précédente si invalide
      setAlertDuration(defaultAlertDuration.toString());
    }
  };

  const handleAlertEdit = (alert: Alert) => {
    setEditingAlert(alert);
  };

  const handleDurationChange = (seconds: number, isValid: boolean) => {
    if (isValid) {
      setDefaultDurationSeconds(seconds);
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
            <Text style={styles.sectionTitle}>Durée par défaut</Text>
            <Text style={styles.sectionDescription}>
              Définissez la durée par défaut pour les nouveaux timers
            </Text>
            
            <View style={styles.durationContainer}>
              {editingDuration ? (
                <>
                  <View style={styles.timeDisplayButton}>
                    <TimeInput
                      initialSeconds={defaultDurationSeconds}
                      onTimeChange={handleDurationChange}
                      timeColor={theme.colors.white}
                    />
                  </View>
                  <Pressable 
                    style={styles.confirmButton}
                    onPress={() => setEditingDuration(false)}
                  >
                    <Icon name="check" size={24} color={theme.colors.white} />
                  </Pressable>
                </>
              ) : (
                <>
                <View style={styles.durationInputContainer}>
                  <Pressable 
                    style={styles.timeDisplayButton}
                    onPress={() => setEditingDuration(true)}
                  >
                    <Text style={styles.durationInput}>
                      {formatTimeFromSeconds(defaultDurationSeconds)}
                    </Text>
                  </Pressable>
                </View>
                <Pressable 
                    style={styles.editButton}
                    onPress={() => setEditingDuration(true)}
                  >
                    <Icon name="edit" size={20} color="#aaa" />
                  </Pressable>
                </>
              )}
            </View>
          </View>
          
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
            <Text style={styles.sectionTitle}>Alertes par défaut</Text>
            <Text style={styles.sectionDescription}>
              Configurez les alertes par défaut qui seront appliquées aux nouveaux timers
            </Text>
            
            {defaultAlerts.map((alert) => {
              const soundConfig = sounds.find(s => s.id === alert.sound);
              if (!soundConfig) return null;

              return (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={styles.alertInfo}>
                    <Icon
                      name={soundConfig.icon as any}
                      size={24}
                      color="#fff"
                    />
                    <View style={styles.alertTextContainer}>
                      <Text style={styles.alertName}>{alert.name}</Text>
                      <Text style={styles.alertDetail}>
                        {alert.id === 'before'
                          ? `${formatTimeFromSeconds(alert.timeOffset)} avant la fin`
                          : alert.id === 'end'
                          ? 'À la fin du timer'
                          : `${formatTimeFromSeconds(alert.timeOffset)} après la fin`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.alertControls}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleAlertEdit(alert)}
                    >
                      <Icon name="edit" size={20} color="#aaa" />
                    </Pressable>
                  </View>
                </View>
              );
            })}
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
        </ScrollView>
        
        {editingAlert && (
          <AlertEditor
            alert={editingAlert}
            isVisible={true}
            onClose={() => setEditingAlert(null)}
            onSave={(updatedAlert) => {
              updateDefaultAlert(updatedAlert);
              setEditingAlert(null);
            }}
          />
        )}
        
      </LinearGradient>
    </SafeAreaView>
  );
}