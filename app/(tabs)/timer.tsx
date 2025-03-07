import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
  useSharedValue,
} from 'react-native-reanimated';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { useTimer } from '../../src/hooks/useTimer';
import { Alert } from '../../src/types/timer';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const {
    minutes,
    seconds,
    isRunning,
    isPaused,
    timeLeft,
    alerts,
    setAlerts,
    activeSound,
    stopActiveSound,
    presets,
    loadPreset,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    handleNumberPress,
    handleBackspace,
    handleColonPress,
    inputMode,
  } = useTimer(30);

  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const flashBackground = useSharedValue(0);
  const activeFlashAlert = useRef<Alert | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeAlertTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  React.useEffect(() => {
    if (params.presetId) {
      const preset = presets.find((p) => p.id === params.presetId);
      if (preset) {
        loadPreset(preset);
      }
    }
  }, [params.presetId, presets]);

  // Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      stopFlashAnimation();
      // Clear all active alert timers
      activeAlertTimers.current.forEach((timer) => {
        clearTimeout(timer);
      });
      activeAlertTimers.current.clear();
    };
  }, []);

  // Gérer l'effet de flash
  useEffect(() => {
    // Clear previous alert timers when timer state changes
    if (!isRunning || isPaused) {
      activeAlertTimers.current.forEach((timer) => {
        clearTimeout(timer);
      });
      activeAlertTimers.current.clear();
      stopFlashAnimation();
      return;
    }

    // Vérifier si une alerte avec effet de flash est active
    const flashAlert = alerts.find(
      alert => alert.enabled && alert.effects.includes('flash') && (
        (alert.id === 'end' && timeLeft === 0) ||
        (alert.id === 'before' && timeLeft <= alert.timeOffset * 60 && timeLeft > 0) ||
        (alert.id === 'after' && timeLeft < 0 && Math.abs(timeLeft) >= alert.timeOffset * 60)
      )
    );

    if (flashAlert && isRunning && !isPaused) {
      // Check if we already have a timer for this alert
      const alertKey = `${flashAlert.id}_${Math.floor(timeLeft)}`;
      if (!activeAlertTimers.current.has(alertKey)) {
        // Démarrer l'animation de flash
        activeFlashAlert.current = flashAlert;
        startFlashAnimation(flashAlert);
        
        // Set a timer to automatically stop this specific alert effect
        const effectDuration = flashAlert.effectDuration || 5; // 5 seconds default
        const timer = setTimeout(() => {
          // Only stop if this is still the active alert
          if (activeFlashAlert.current?.id === flashAlert.id) {
            stopFlashAnimation();
            activeFlashAlert.current = null;
          }
          // Remove this timer from the active timers map
          activeAlertTimers.current.delete(alertKey);
        }, effectDuration * 1000);
        
        // Store the timer reference
        activeAlertTimers.current.set(alertKey, timer);
      }
    }

    return () => {
      // No cleanup here - we'll handle it in the component unmount
    };
  }, [timeLeft, isRunning, isPaused, alerts]);

  const startFlashAnimation = (alert: Alert) => {
    // Arrêter toute animation précédente
    stopFlashAnimation();

    // Démarrer l'animation de flash
    flashBackground.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) })
      ),
      -1 // Répéter indéfiniment
    );
  };

  const stopFlashAnimation = () => {
    // Annuler l'animation
    cancelAnimation(flashBackground);
    flashBackground.value = 0;

    // Nettoyer le timer
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
  };

  const handleStop = () => {
    stopTimer();
    stopFlashAnimation();
    
    // Clear all active alert timers
    activeAlertTimers.current.forEach((timer) => {
      clearTimeout(timer);
    });
    activeAlertTimers.current.clear();
    
    router.replace('/');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const prefix = seconds < 0 ? '-' : '';
    return `${prefix}${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const beforeAlert = alerts.find((a) => a.id === 'before' && a.enabled);
    
    // Si le temps est négatif, afficher en rouge
    if (timeLeft < 0) return '#f44336';
    
    // Si l'alerte "bientôt fini" est activée et que le temps restant est inférieur ou égal à son seuil
    if (beforeAlert && beforeAlert.enabled && timeLeft <= beforeAlert.timeOffset * 60) {
      return '#FF9800';
    }
    
    return '#fff';
  };

  const getAlertTimeColor = (alert: Alert) => {
    // Si c'est l'alerte "bientôt fini" et que le timer total est inférieur à son seuil
    if (alert.id === 'before' && alert.enabled && !isRunning && 
        (minutes * 60 + seconds) <= alert.timeOffset * 60) {
      return '#f44336'; // Rouge pour indiquer que l'alerte ne pourra pas se déclencher normalement
    }
    
    return undefined; // Utiliser la couleur par défaut
  };

  const animatedFlashStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      opacity: flashBackground.value * 0.7, // Ajuster l'opacité pour un effet plus visible
      zIndex: 1,
    };
  });

  const renderKeypadButton = (num: number) => (
    <Pressable
      style={styles.keypadButton}
      onPress={() => handleNumberPress(num)}
    >
      <Text style={styles.keypadButtonText}>{num}</Text>
    </Pressable>
  );

  // Fonction pour arrêter tous les effets (son et visuel)
  const handleStopAllEffects = () => {
    stopActiveSound();
    stopFlashAnimation();
    
    // Clear all active alert timers
    activeAlertTimers.current.forEach((timer) => {
      clearTimeout(timer);
    });
    activeAlertTimers.current.clear();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <Animated.View style={animatedFlashStyle} />
        
        <BlurView intensity={50} style={styles.timerContainer}>
          <View style={styles.timeDisplayContainer}>
            <View style={styles.timeDisplay}>
              <AnimatedText style={[
                styles.timeText, 
                { color: getTimeColor() }
              ]}>
                {!isRunning
                  ? `${minutes.toString().padStart(2, '0')}:${seconds
                      .toString()
                      .padStart(2, '0')}`
                  : formatTime(timeLeft)}
              </AnimatedText>
              {!isRunning && (
                <Text style={styles.inputModeText}>
                  {inputMode === 'minutes' ? 'Minutes' : 'Secondes'}
                </Text>
              )}
            </View>
            {activeSound && (
              <Pressable style={styles.stopSoundButton} onPress={handleStopAllEffects}>
                <Icon name="no_sound" size={24} color="#fff" />
              </Pressable>
            )}
          </View>

          {!isRunning && (
            <View style={styles.keypad}>
              <View style={styles.keypadRow}>
                {renderKeypadButton(1)}
                {renderKeypadButton(2)}
                {renderKeypadButton(3)}
              </View>
              <View style={styles.keypadRow}>
                {renderKeypadButton(4)}
                {renderKeypadButton(5)}
                {renderKeypadButton(6)}
              </View>
              <View style={styles.keypadRow}>
                {renderKeypadButton(7)}
                {renderKeypadButton(8)}
                {renderKeypadButton(9)}
              </View>
              <View style={styles.keypadRow}>
                <Pressable
                  style={[styles.keypadButton, styles.specialButton]}
                  onPress={handleBackspace}
                >
                  <Icon name="backspace" size={24} color="#eee" />
                </Pressable>
                {renderKeypadButton(0)}
                <Pressable
                  style={[styles.keypadButton, styles.specialButton]}
                  onPress={handleColonPress}
                >
                  <Text style={[styles.keypadButtonText, { fontSize: 32 }]}>
                    :
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.controls}>
            {!isRunning ? (
              <Pressable
                style={[styles.button, styles.startButton]}
                onPress={startTimer}
              >
                <Icon name="play-arrow" size={24} color="#fff" />
              </Pressable>
            ) : (
              <>
                <Pressable
                  style={[styles.button, styles.stopButton]}
                  onPress={handleStop}
                >
                  <Icon name="stop" size={24} color="#fff" />
                </Pressable>
                <Pressable
                  style={[styles.button, styles.pauseButton]}
                  onPress={isPaused ? resumeTimer : pauseTimer}
                >
                  <Icon
                    name={isPaused ? "resume" : "pause"}
                    size={24}
                    color="#fff"
                  />
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.alertsContainer}>
            <View style={styles.alertsList}>
              {alerts.map((alert) => (
                <AlertIcon
                  key={alert.id}
                  alert={alert}
                  isActive={
                    alert.enabled &&
                    (alert.id === 'end'
                      ? timeLeft === 0
                      : alert.id === 'before'
                      ? timeLeft <= alert.timeOffset * 60 && timeLeft > 0
                      : timeLeft < 0 &&
                        Math.abs(timeLeft) >= alert.timeOffset * 60)
                  }
                  onPress={() => setEditingAlert(alert)}
                  onToggle={(enabled) => {
                    setAlerts((prev) =>
                      prev.map((a) => (a.id === alert.id ? { ...a, enabled } : a))
                    );
                  }}
                  timeColor={getAlertTimeColor(alert)}
                  onStopEffects={stopFlashAnimation}
                />
              ))}
            </View>
          </View>
        </BlurView>

        {editingAlert && (
          <AlertEditor
            alert={editingAlert}
            isVisible={true}
            onClose={() => setEditingAlert(null)}
            onSave={(updatedAlert) => {
              setAlerts((prev) =>
                prev.map((alert) =>
                  alert.id === updatedAlert.id ? updatedAlert : alert
                )
              );
              setEditingAlert(null);
            }}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}