import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { theme } from '../../src/theme';
import { useTimer } from '../../src/hooks/useTimer';
import { useIsFocused } from '@react-navigation/native';
import { TimerRunning } from '../../src/components/Timer/TimerRunning';
import { TimerEditing } from '../../src/components/Timer/TimerEditing';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();

  const {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    actions,
    presetColor,
    presetName,
    effectDuration,
    shouldFlash,
    hasActiveAlert,
  } = useTimer();

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('[TimerScreen] 🔔 useEffect [isFocused] :', isFocused);
    if(isFocused) {
      if (params.presetId) {
        actions.loadPreset(params.presetId);
      } else {
        actions.resetFromDefault();
      }
    }
    else {
      actions.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, params.presetId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View 
        style={[styles.container, { backgroundColor: presetColor ? presetColor + '66' : theme.colors.background.primary }]}
      >
        {isRunning ? (
          <TimerRunning
            duration={duration}
            timeLeft={timeLeft}
            isRunning={isRunning}
            state={state}
            beforeAlert={beforeAlert}
            endAlert={endAlert}
            afterAlert={afterAlert}
            effectDuration={effectDuration}
            presetName={presetName}
            presetColor={presetColor}
            shouldFlash={shouldFlash}
            hasActiveAlert={hasActiveAlert}
            actions={actions}
          />
        ) : (
          <TimerEditing
            duration={duration}
            timeLeft={timeLeft}
            isRunning={isRunning}
            state={state}
            beforeAlert={beforeAlert}
            endAlert={endAlert}
            afterAlert={afterAlert}
            effectDuration={effectDuration}
            presetName={presetName}
            presetColor={presetColor}
            shouldFlash={shouldFlash}
            hasActiveAlert={hasActiveAlert}
            actions={actions}
          />
        )}
      </View>
    </SafeAreaView>    
  );
}
