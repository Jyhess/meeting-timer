import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { theme } from '../../src/theme';
import { useTimerRedux } from '../../src/hooks/useTimerRedux';
import { useIsFocused } from '@react-navigation/native';
import { TimerRunning } from '../../src/components/Timer/TimerRunning';
import { TimerEditing } from '../../src/components/Timer/TimerEditing';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const isFocused = useIsFocused();
  const { isRunning, presetColor, loadTimerFromPreset, resetNewTimer, stopAlerts } = useTimerRedux();

  useEffect(() => {
    console.log('[TimerScreen] 🔔 useEffect [isFocused] :', isFocused);
    if(isFocused) {
      if (params.presetId) {
        loadTimerFromPreset(params.presetId);
      } else {
        resetNewTimer();
      }
    }
    else {
      stopAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, params.presetId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View 
        style={[styles.container, { backgroundColor: presetColor ? presetColor + '66' : theme.colors.background.primary }]}
      >
        {isRunning ? <TimerRunning /> : <TimerEditing />}
      </View>
    </SafeAreaView>    
  );
}
