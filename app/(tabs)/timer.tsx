import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { useTimerScreen } from '../../src/hooks/useTimerScreen';
import { Alert } from '../../src/types/timer';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { TimerManager } from '../../src/utils/TimerManager';
import { theme } from '../../src/theme';
import { TimeDisplay } from '../../src/components/Timer/TimeDisplay';
import { Keypad } from '../../src/components/Timer/Keypad';
import { FlashView, FlashViewRef } from '../../src/components/Timer/FlashView';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const [key, setKey] = useState(0);
  const timerManagerRef = useRef<TimerManager>(new TimerManager());
  const flashViewRef = useRef<FlashViewRef>(null);
  
  const {
    timeLeft,
    isRunning,
    state,
    presets,
    loadPreset,
    handleNumberPress,
    handleBackspace,
    handleDoubleZero,
    start,
    pause,
    resume,
    reset,
    restart,
    updateAlert,
    isValidTime,
  } = useTimerScreen(timerManagerRef, key);

  // Convertir les alertes en type Alert
  const beforeAlert = timerManagerRef.current?.getBeforeAlert();
  const endAlert = timerManagerRef.current?.getEndAlert();
  const afterAlert = timerManagerRef.current?.getAfterAlert();
  
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const startedAlerts = useRef<Set<string>>(new Set());

  // Réinitialiser le timer avec les valeurs par défaut quand on arrive sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      if (!params.presetId) {
        // Créer un nouveau TimerManager pour avoir les valeurs par défaut
        timerManagerRef.current = new TimerManager();
        // Forcer un refresh du hook useTimerScreen
        setKey(k => k + 1);
      }
    }, [params.presetId])
  );

  // Charger le preset si presetId est fourni
  React.useEffect(() => {
    if (params.presetId) {
      const preset = presets.find((p) => p.id === params.presetId);
      if (preset) {
        loadPreset(preset);
      }
    }
  }, [params.presetId, presets]);

  // Gérer l'effet de flash pour les alertes
  useEffect(() => {
    if (!isRunning) {
      flashViewRef.current?.stopAnimation();
      startedAlerts.current.clear();
      return;
    }

    const shouldFlash = [beforeAlert, endAlert, afterAlert].some(alert => {
      if (!alert?.enabled || !alert.effects.includes('flash')) return false;

      const shouldStart = (
        (alert.id === 'end' && timeLeft === 0) ||
        (alert.id === 'before' && timeLeft === alert.timeOffset * 60) ||
        (alert.id === 'after' && timeLeft === -alert.timeOffset * 60)
      );

      const alertKey = `${alert.id}`;

      // Si l'alerte doit démarrer et n'est pas déjà démarrée
      if (shouldStart && !startedAlerts.current.has(alertKey)) {
        startedAlerts.current.add(alertKey);
        return true;
      }

      return false;
    });

    if (shouldFlash) {
      flashViewRef.current?.startAnimation();
    }
  }, [timeLeft, isRunning, beforeAlert, endAlert, afterAlert]);

  const handleStop = () => {
    reset();
    flashViewRef.current?.stopAnimation();
    startedAlerts.current.clear();
    
    if(state === 'idle') {
      router.replace('/');
    }
  };

  const getAlertTimeColor = (alert: Alert) => {
    // Si c'est l'alerte "bientôt fini" et que le timer total est inférieur à son seuil
    if (alert.id === 'before' && alert.enabled && !isRunning && 
        timeLeft <= alert.timeOffset * 60) {
      return theme.colors.error;
    }
    
    return undefined;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient 
        colors={[theme.colors.background.primary, theme.colors.background.secondary]} 
        style={styles.container}
      >
        <FlashView 
          ref={flashViewRef}
          effectDuration={timerManagerRef.current.getEffectDuration()}
        />
        
        <View style={styles.timerContainer}>
          <TimeDisplay
            timeLeft={timeLeft}
            isValidTime={isValidTime}
            beforeAlert={beforeAlert}
          />

          {!isRunning && (
            <Keypad
              onNumberPress={handleNumberPress}
              onBackspace={handleBackspace}
              onDoubleZero={handleDoubleZero}
            />
          )}

          <View style={styles.controls}>
            {!isRunning ? (
              <>
                <Pressable 
                  style={[
                    styles.controlButton,
                    !isValidTime && styles.controlButtonDisabled
                  ]} 
                  onPress={start}
                  disabled={!isValidTime}
                >
                  <Icon 
                    name="play_arrow" 
                    size={32} 
                    color={isValidTime ? theme.colors.primary : theme.colors.disabled}
                  />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={handleStop}>
                  <Icon name="close" size={32} color={theme.colors.danger} />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={styles.controlButton} onPress={state === 'paused' ? resume : pause}>
                  <Icon 
                    name={state === 'paused' ? "play_arrow" : "pause"} 
                    size={32} 
                    color={theme.colors.secondary}
                  />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={handleStop}>
                  <Icon name="stop" size={32} color={theme.colors.danger} />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={restart}>
                  <Icon name="restart" size={32} color={theme.colors.primary} />
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.alertsContainer}>
            {[beforeAlert, endAlert, afterAlert].map((alert) => alert && (
              <AlertIcon
                key={alert.id}
                alert={alert}
                isActive={
                  alert.enabled &&
                  isRunning && // Ne déclencher les alertes que si le timer tourne
                  (alert.id === 'end'
                    ? timeLeft <= 0
                    : alert.id === 'before'
                    ? timeLeft <= alert.timeOffset * 60
                    : timeLeft < 0 &&
                      Math.abs(timeLeft) >= alert.timeOffset * 60)
                }
                onPress={() => setEditingAlert(alert)}
                onToggle={(enabled) => {
                  const updatedAlert = { ...alert, enabled };
                  updateAlert(updatedAlert);
                }}
                timeColor={getAlertTimeColor(alert)}
              />
            ))}
          </View>
        </View>

        {editingAlert && (
          <View>
            <AlertEditor
              alert={editingAlert}
              isVisible={true}
              onClose={() => setEditingAlert(null)}
              onSave={(updatedAlert) => {
                updateAlert(updatedAlert);
                setEditingAlert(null);
              }}
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>    
  );
}

