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
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { Alert } from '../../src/types/timer';
import { useSettings } from '../../src/hooks/useSettings';
import { styles } from '../../src/styles/Settings.styles';
import { ALERT_SOUNDS } from '../../src/types/alerts';

export default function SettingsScreen() {
  const { 
    defaultTimerMinutes, 
    setDefaultTimerMinutes,
    defaultAlerts,
    defaultAlertDuration,
    setDefaultAlertDuration,
    updateDefaultAlert,
  } = useSettings();
    
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [minutes, setMinutes] = useState(defaultTimerMinutes.toString());
  const [alertDuration, setAlertDuration] = useState(defaultAlertDuration.toString());
  
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
    } else {
      // Réinitialiser à la valeur précédente si invalide
      setAlertDuration(defaultAlertDuration.toString());
    }
  };

  const handleAlertEdit = (alert: Alert) => {
    setEditingAlert(alert);
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
            
            {defaultAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertInfo}>
                  <Icon
                    name={ALERT_SOUNDS[alert.sound].iconName as any}
                    size={24}
                    color="#fff"
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