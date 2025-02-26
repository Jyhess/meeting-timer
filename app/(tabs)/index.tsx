import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimer } from '../../src/hooks/useTimer';
import { Icon } from '../../src/components/Timer/Icon';

const formatTime = (minutes: number) => {
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { presets, refreshPresets } = useTimer(30);

  useFocusEffect(
    React.useCallback(() => {
      refreshPresets();
    }, [])
  );

  return (
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
            <Icon name="alarm-add" size={48} color="#666" />
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
                          color="#666"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Changé de 'flex-end' à 'center'
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  presetList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  grid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTime: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  alertIcons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  alertIcon: {
    opacity: 0.6,
  },
});
