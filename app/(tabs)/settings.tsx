import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  TextInput,
  Vibration,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Icon } from '../../src/components/Timer/Icon';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { Alert } from '../../src/types/timer';
import { useSettings } from '../../src/hooks/useSettings';
import { styles } from '../../src/styles/Settings.styles';
import { useCustomSounds } from '../../src/hooks/useCustomSounds';
import { CustomSoundSelector } from '../../src/components/Timer/CustomSoundSelector';

export default function SettingsScreen() {
  const { 
    defaultTimerMinutes, 
    setDefaultTimerMinutes,
    defaultAlerts,
    setDefaultAlerts,
    defaultAlertDuration,
    setDefaultAlertDuration,
    saveSettings
  } = useSettings();
  
  const { customSounds, pickAudioFile, removeCustomSound } = useCustomSounds();
  
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [minutes, setMinutes] = useState(defaultTimerMinutes.toString());
  const [alertDuration, setAlertDuration] = useState(defaultAlertDuration.toString());
  const [showCustomSoundSelector, setShowCustomSoundSelector] = useState(false);
  
  useEffect(() => {
    setMinutes(defaultTimerMinutes.toString());
    setAlertDuration(defaultAlertDuration.toString());
  }, [defaultTimerMinutes, defaultAlertDuration]);

  const handleMinutesChange = (text: string) => {
    // Accepter uniquement les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    setMinutes(numericValue);
  };

  const handleMinutesBlur = () => {
    const numValue = parseInt(minutes, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 99) {
      setDefaultTimerMinutes(numValue);
      saveSettings();
    } else {
      // Réinitialiser à la valeur précédente si invalide
      setMinutes(defaultTimerMinutes.toString());
    }
  };

  const handleAlertDurationChange = (text: string) => {
    // Accepter uniquement les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    setAlertDuration(numericValue);
  };

  const handleAlertDurationBlur = () => {
    const numValue = parseInt(alertDuration, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setDefaultAlertDuration(numValue);
      
      // Mettre à jour la durée pour toutes les alertes
      setDefaultAlerts(prev => 
        prev.map(alert => {
          const updatedAlert = { ...alert };
          
          // Mettre à jour la durée de vibration pour les alertes avec effet "shake"
          if (alert.effects.includes('shake')) {
            updatedAlert.vibrationDuration = numValue;
          }
          
          // Mettre à jour la durée des effets pour les alertes avec effets visuels
          if (alert.effects.includes('flash')) {
            updatedAlert.effectDuration = numValue;
          }
          
          return updatedAlert;
        })
      );
      
      saveSettings();
    } else {
      // Réinitialiser à la valeur précédente si invalide
      setAlertDuration(defaultAlertDuration.toString());
    }
  };

  const handleAddCustomSound = async () => {
    await pickAudioFile();
  };

  const handleAlertEdit = (alert: Alert) => {
    setEditingAlert(alert);
  };

  const handleAlertSave = (updatedAlert: Alert) => {
    setDefaultAlerts(prev => 
      prev.map(alert => 
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );
    saveSettings();
    setEditingAlert(null);
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
              <View style={styles.durationInputContainer}>
                <TextInput
                  style={styles.durationInput}
                  value={minutes}
                  onChangeText={handleMinutesChange}
                  onBlur={handleMinutesBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <Text style={styles.durationUnit}>minutes</Text>
              </View>
              
              <View style={styles.durationControls}>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.max(1, parseInt(minutes, 10) - 1);
                    setMinutes(newValue.toString());
                    setDefaultTimerMinutes(newValue);
                    saveSettings();
                  }}
                >
                  <Icon name="remove" size={24} color="#eee" />
                </Pressable>
                
                <Pressable
                  style={styles.durationButton}
                  onPress={() => {
                    const newValue = Math.min(99, parseInt(minutes, 10) + 1);
                    setMinutes(newValue.toString());
                    setDefaultTimerMinutes(newValue);
                    saveSettings();
                  }}
                >
                  <Icon name="add" size={24} color="#eee" />
                </Pressable>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Durée des alertes</Text>
            <Text style={styles.sectionDescription}>
              Définissez la durée des alertes (vibrations et effets visuels) en secondes
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
                    saveSettings();
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
                    saveSettings();
                  }}
                >
                  <Icon name="add" size={24} color="#eee" />
                </Pressable>
              </View>
            </View>
            
            {Platform.OS !== 'web' && (
              <Pressable
                style={[
                  styles.durationButton,
                  { alignSelf: 'center', marginTop: 16 }
                ]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  } else {
                    Vibration.vibrate(300);
                  }
                }}
              >
                <Text style={styles.testButtonText}>Tester</Text>
              </Pressable>
            )}
          </View>
          
          {Platform.OS !== 'web' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sons personnalisés</Text>
              <Text style={styles.sectionDescription}>
                Gérez vos sons personnalisés pour les alertes
              </Text>
              
              {customSounds.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="music_note" size={36} color="#888" />
                  <Text style={styles.emptyStateText}>Aucun son personnalisé</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Ajoutez des sons personnalisés pour les utiliser dans vos alertes
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={customSounds}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.soundItem}>
                      <View style={styles.soundInfo}>
                        <Icon name="music_note" size={24} color="#aaa" />
                        <Text style={styles.soundName} numberOfLines={1} ellipsizeMode="middle">
                          {item.name}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => removeCustomSound(item.id)}
                      >
                        <Icon name="close" size={20} color="#f44336" />
                      </Pressable>
                    </View>
                  )}
                  style={styles.soundsList}
                  contentContainerStyle={styles.soundsListContent}
                />
              )}
              
              <Pressable
                style={styles.addSoundButton}
                onPress={handleAddCustomSound}
              >
                <Icon name="add" size={20} color="#eee" />
                <Text style={styles.addSoundButtonText}>Ajouter un son</Text>
              </Pressable>
            </View>
          )}
          
          {Platform.OS === 'web' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sons personnalisés</Text>
              <Text style={styles.sectionDescription}>
                Les sons personnalisés ne sont pas disponibles sur la version web
              </Text>
              
              <View style={styles.emptyState}>
                <Icon name="music_note" size={36} color="#888" />
                <Text style={styles.emptyStateText}>Fonctionnalité non disponible</Text>
                <Text style={styles.emptyStateSubtext}>
                  Cette fonctionnalité est uniquement disponible sur les applications mobiles
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertes par défaut</Text>
            <Text style={styles.sectionDescription}>
              Configurez les alertes par défaut qui seront appliquées aux nouveaux timers
            </Text>
            
            {defaultAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertInfo}>
                  <Icon
                    name={
                      alert.sound === 'gong'
                        ? 'gong'
                        : alert.sound === 'bell'
                        ? 'notifications'
                        : alert.sound === 'chime'
                        ? 'doorbell'
                        : 'siren'
                    }
                    size={24}
                    color="#aaa"
                  />
                  <View style={styles.alertTextContainer}>
                    <Text style={styles.alertName}>{alert.name}</Text>
                    <Text style={styles.alertDetail}>
                      {alert.id === 'before'
                        ? `${alert.timeOffset} min avant la fin`
                        : alert.id === 'end'
                        ? 'À la fin du timer'
                        : `${alert.timeOffset} min après la fin`}
                    </Text>
                  </View>
                </View>
                <View style={styles.alertControls}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() => handleAlertEdit(alert)}
                  >
                    <Icon name="settings" size={20} color="#aaa" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        
        {editingAlert && (
          <AlertEditor
            alert={editingAlert}
            isVisible={true}
            onClose={() => setEditingAlert(null)}
            onSave={handleAlertSave}
          />
        )}
        
        {showCustomSoundSelector && Platform.OS !== 'web' && (
          <CustomSoundSelector
            isVisible={showCustomSoundSelector}
            onClose={() => setShowCustomSoundSelector(false)}
            onSelect={() => {}}
            onAddNew={handleAddCustomSound}
            selectedUri=""
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}