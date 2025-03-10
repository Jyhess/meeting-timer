import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
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
import { useTimerScreen } from '../../src/hooks/useTimerScreen';
import { Alert, AlertEffect } from '../../src/types/timer';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { TimerManager } from '../../src/utils/TimerManager';
import { formatTime } from '../../src/utils/time';
import { theme } from '../../src/theme';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const [key, setKey] = useState(0);
  const timerManagerRef = useRef<TimerManager>(new TimerManager());
  
  const {
    minutes,
    seconds,
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
    updateAlert,
    isValidTime,
  } = useTimerScreen(timerManagerRef, key);

  // Convertir les alertes en type Alert
  const beforeAlert = timerManagerRef.current?.getBeforeAlert();
  const endAlert = timerManagerRef.current?.getEndAlert();
  const afterAlert = timerManagerRef.current?.getAfterAlert();
  
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const flashBackground = useSharedValue(0);
  const activeFlashAlert = useRef<Alert | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      stopFlashAnimation();
    };
  }, []);

  // Réinitialiser les alertes déclenchées quand le timer s'arrête
  useEffect(() => {
    if (state !== 'running') {
      startedAlerts.current.clear();
    }
  }, [state]);

  // Gérer l'effet de flash
  const handleAlertEffect = (alert: Alert | null) => {
    if (!alert?.enabled || !alert.effects.includes('flash')) return;

    const shouldStart = (
      (alert.id === 'end' && timeLeft === 0) ||
      (alert.id === 'before' && timeLeft === alert.timeOffset * 60) ||
      (alert.id === 'after' && timeLeft === -alert.timeOffset * 60)
    );

    const alertKey = `${alert.id}`;

    // Si l'alerte doit démarrer et n'est pas déjà démarrée
    if (shouldStart && !startedAlerts.current.has(alertKey)) {
      startedAlerts.current.add(alertKey);
      activeFlashAlert.current = alert;
      startFlashAnimation(alert);

      setTimeout(() => {
        if (activeFlashAlert.current?.id === alert.id) {
          stopFlashAnimation();
          activeFlashAlert.current = null;
        }
      }, timerManagerRef.current.getEffectDuration() * 1000);
    }
  };

  useEffect(() => {
    // Si le timer n'est pas en cours, tout arrêter
    if (state !== 'running') {
      startedAlerts.current.clear();
      stopFlashAnimation();
      return;
    }

    // Vérifier chaque alerte individuellement
    handleAlertEffect(beforeAlert);
    handleAlertEffect(endAlert);
    handleAlertEffect(afterAlert);

    return () => {
      // Cleanup géré dans le unmount du composant
    };
  }, [timeLeft, state, beforeAlert, endAlert, afterAlert]);

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
    reset();
    stopFlashAnimation();
    
    startedAlerts.current.clear();
    if(state === 'idle') {
      router.replace('/');
    }
  };

  const getTimeColor = () => {    
    // Si le temps est invalide, afficher en orange
    if (!isValidTime) return theme.colors.invalid;
    
    // Si le temps est négatif, afficher en rouge
    if (timeLeft < 0) return theme.colors.error;
    
    // Si l'alerte "bientôt fini" est activée et que le temps restant est inférieur ou égal à son seuil
    if (beforeAlert?.enabled && timeLeft <= beforeAlert.timeOffset * 60) {
      return theme.colors.secondary;
    }
    
    return theme.colors.white;
  };

  const getAlertTimeColor = (alert: Alert) => {
    // Si c'est l'alerte "bientôt fini" et que le timer total est inférieur à son seuil
    if (alert.id === 'before' && alert.enabled && !isRunning && 
        (minutes * 60 + seconds) <= alert.timeOffset * 60) {
      return theme.colors.error;
    }
    
    return undefined;
  };

  const animatedFlashStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      opacity: flashBackground.value * 0.7,
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient 
        colors={[theme.colors.background.primary, theme.colors.background.secondary]} 
        style={styles.container}
      >
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
            </View>
          </View>

          {!isRunning ? (
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
                  style={styles.keypadButton}
                  onPress={handleBackspace}
                >
                  <Icon name="backspace" size={24} color={theme.colors.white} />
                </Pressable>
                {renderKeypadButton(0)}
                <Pressable
                  style={styles.keypadButton}
                  onPress={handleDoubleZero}
                >
                  <Text style={styles.keypadButtonText}>00</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

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
        </BlurView>

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

