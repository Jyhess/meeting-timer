import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/Timer.styles';
import { theme } from '../../theme';
import Animated from 'react-native-reanimated';
import { formatTime } from '../../utils/time';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface TimeDisplayProps {
  timeLeft: number;
  isValidTime: boolean;
  beforeAlert?: {
    enabled: boolean;
    timeOffset: number;
  };
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeLeft,
  isValidTime,
  beforeAlert
}) => {
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

  return (
    <View style={styles.timeDisplayContainer}>
      <View style={styles.timeDisplay}>
        <AnimatedText style={[styles.timeText, { color: getTimeColor() }]}>
          {formatTime(timeLeft)}
        </AnimatedText>
      </View>
    </View>
  );
}; 