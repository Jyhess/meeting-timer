import React, { useState, useRef } from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { Alert } from '../../src/types/timer';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { theme } from '../../src/theme';
import { TimerInput } from '../../src/components/Timer/TimerInput';
import { TimerOutput } from '../../src/components/Timer/TimerOutput';
import { FlashView, FlashViewRef } from '../../src/components/Timer/FlashView';
import { useTimer } from '../../src/hooks/useTimer';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string, seed?: string }>();
  const [lastSeed, setLastSeed] = useState<string | null>(null);
  const flashViewRef = useRef<FlashViewRef>(null);
  const startedAlerts = useRef<Set<string>>(new Set());
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    effectDuration,
    hasActiveAlert,
    actions,
  } = useTimer();

  // Calculer isValidTime
  const [validInput, setValidInput] = useState(true);
  const isValidTime = validInput && timeLeft > 0 && (!beforeAlert.enabled || timeLeft > beforeAlert.timeOffset * 60);

  // Réinitialiser le timer quand le seed change
  React.useEffect(() => {
    if (params.seed !== lastSeed) {
      setLastSeed(params.seed || null);
      if (params.presetId) {
        actions.loadPreset(params.presetId);
      } else {
        actions.resetFromDefault();
      }
    }
  }, [params.seed, params.presetId, lastSeed, actions]);

  // Gérer l'effet de flash pour les alertes
  React.useEffect(() => {
    if (state !== 'running') {
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

      if (shouldStart && !startedAlerts.current.has(alertKey)) {
        startedAlerts.current.add(alertKey);
        return true;
      }

      return false;
    });

    if (shouldFlash) {
      flashViewRef.current?.startAnimation();
    }
  }, [state, timeLeft, beforeAlert, endAlert, afterAlert]);

  const handleStop = () => {
    actions.reset();
    actions.stopAlerts();
    flashViewRef.current?.stopAnimation();
    startedAlerts.current.clear();
    
    if (state === 'idle') {
      router.replace('/');
    }
  };

  const getAlertTimeColor = (alert: Alert) => {
    if (alert.id === 'before' && alert.enabled && state === 'idle' && 
        timeLeft <= alert.timeOffset * 60) {
      return theme.colors.error;
    }
    return undefined;
  };

  const handleDurationChange = (duration: number, isValidTime: boolean) => {
    setValidInput(isValidTime);
    if (isValidTime) {
      actions.setDuration(duration);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient 
        colors={[theme.colors.background.primary, theme.colors.background.secondary]} 
        style={styles.container}
      >
        <FlashView 
          ref={flashViewRef}
          effectDuration={effectDuration}
        />
        
        <View style={styles.timerContainer}>
          {!isRunning ? (
            <TimerInput
              timeLeft={timeLeft}
              beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
              onDurationChange={handleDurationChange}
            />
          ) : (
            <TimerOutput
              timeLeft={timeLeft}
              beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
            />
          )}
          {isRunning && hasActiveAlert && (
            <Pressable 
              style={[styles.controlButton, styles.alertStopButton]} 
              onPress={() => {
                actions.stopAlerts();
                flashViewRef.current?.stopAnimation();
                startedAlerts.current.clear();
              }}
            >
              <Icon name="volume_off" size={32} color={theme.colors.danger} />
            </Pressable>
          )}

          <View style={styles.controls}>
            {!isRunning ? (
              <>
                <Pressable 
                  style={[
                    styles.controlButton,
                    !isValidTime && styles.controlButtonDisabled
                  ]} 
                  onPress={actions.start}
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
                <Pressable style={styles.controlButton} onPress={state === 'paused' ? actions.resume : actions.pause}>
                  <Icon 
                    name={state === 'paused' ? "play_arrow" : "pause"} 
                    size={32} 
                    color={theme.colors.secondary}
                  />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={handleStop}>
                  <Icon name="stop" size={32} color={theme.colors.danger} />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={actions.reset}>
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
                  isRunning &&
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
                  actions.updateAlert(updatedAlert);
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
                actions.updateAlert(updatedAlert);
                setEditingAlert(null);
              }}
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>    
  );
}

