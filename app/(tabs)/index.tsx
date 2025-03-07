import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimer } from '../../src/hooks/useTimer';
import { Icon } from '../../src/components/Timer/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Home.styles';

const formatTime = (minutes: number) => {
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { presets, refreshPresets } = useTimer(30);

  // Use useCallback to prevent unnecessary re-renders
  const loadPresets = useCallback(async () => {
    await refreshPresets();
  }, [refreshPresets]);

  useFocusEffect(
    useCallback(() => {
      loadPresets();
      
      return () => {
        // Cleanup function when screen loses focus
      };
    }, [loadPresets])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <View style={styles.header}>
          <Link href="/timer" asChild>
            <Pressable style={styles.newButton}>
              <Icon name="add" size={24} color="#fff" />
              <Text style={styles.newButtonText}>Nouveau Timer</Text>
            </Pressable>
          </Link>
        </View>

        <ScrollView style={styles.presetList}>
          {presets.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="alarm-add" size={48} color="#888" />
              <Text style={styles.emptyStateText}>Aucun timer enregistré</Text>
              <Text style={styles.emptyStateSubtext}>
                Créez votre premier timer en cliquant sur "Nouveau Timer"
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {presets.map((preset) => (
                <Link
                  key={preset.id}
                  href={{
                    pathname: '/timer',
                    params: { presetId: preset.id },
                  }}
                  asChild
                >
                  <Pressable style={styles.presetCard}>
                    <Text style={styles.presetTime}>
                      {formatTime(preset.minutes)}
                    </Text>
                    <View style={styles.alertIcons}>
                      {preset.alerts
                        .filter((a) => a.enabled)
                        .map((alert) => (
                          <Icon
                            key={alert.id}
                            name={
                              alert.sound === 'gong'
                                ? 'gong'
                                : alert.sound === 'bell'
                                ? 'notifications'
                                : 'crisis_alert'
                            }
                            size={20}
                            color="#888"
                            style={styles.alertIcon}
                          />
                        ))}
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}