import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { usePresets } from '../../src/hooks/usePresets';
import { Icon } from '../../src/components/Timer/Icon';
import { PresetCard } from '../../src/components/Timer/PresetCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Home.styles';
import { theme } from '@/src/theme';
import { TimerPreset } from '../../src/types/timer';

export default function PresetsScreen() {
  const { autoPresets, bookmarkedPresets: manualPresets, isLoading, loadPresets } = usePresets();

  useFocusEffect(
    useCallback(() => {
      loadPresets();
      return () => {
        // Cleanup function when screen loses focus
      };
    }, [loadPresets])
  );

  const renderPresetLink = (preset: TimerPreset) => (
    <Link
      key={preset.id}
      href={{
        pathname: '/timer',
        params: { 
          presetId: preset.id,
        },
      }}
      asChild
    >
      <Pressable style={styles.presetCard}>
        <PresetCard preset={preset} />
      </Pressable>
    </Link>
  );

  const renderPresetSection = (title: string, items: TimerPreset[]) => (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>{title}</Text>
      <View style={[styles.grid, localStyles.sectionGrid]}>
        {items.map(renderPresetLink)}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#888" />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (autoPresets.length === 0 && manualPresets.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
          <View style={styles.emptyState}>
            <Icon name="alarm_add" size={48} color="#888" />
            <Text style={styles.emptyStateText}>Aucun timer enregistré</Text>
            <Text style={styles.emptyStateSubtext}>
              Créez un timer en utilisant l'onglet Timer
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
        <ScrollView style={styles.presetList}>
          {autoPresets.length > 0 && renderPresetSection('Récents', autoPresets)}
          {manualPresets.length > 0 && renderPresetSection('Mes Timers', manualPresets)}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  sectionGrid: {
    marginHorizontal: theme.spacing.small,
  },
}); 