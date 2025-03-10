import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePresets } from '../../src/hooks/usePresets';
import { Icon } from '../../src/components/Timer/Icon';
import { PresetCard } from '../../src/components/Timer/PresetCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Home.styles';

export default function HomeScreen() {
  const { presets, isLoading, refreshPresets } = usePresets();

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
          {isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#888" />
            </View>
          ) : presets.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="alarm_add" size={48} color="#888" />
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
                    <PresetCard
                      preset={preset}
                      style={styles.presetCardInner}
                      timeStyle={styles.presetTime}
                      iconColor="#fff"
                      iconSize={20}
                    />
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