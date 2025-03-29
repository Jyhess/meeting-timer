import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { usePresets } from '../../src/hooks/usePresets';
import { Icon } from '../../src/components/Timer/Icon';
import { PresetCard } from '../../src/components/Timer/PresetCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Presets.styles';
import { theme } from '@/src/theme';
import { TimerPreset } from '../../src/types/timer';
import { SavePresetDialog } from '../../src/components/Timer/SavePresetDialog';
import { ConfirmDialog } from '../../src/components/Timer/ConfirmDialog';

export default function PresetsScreen() {
  const { 
    autoPresets, 
    bookmarkedPresets: manualPresets, 
    isLoading, 
    loadPresets, 
    removePreset, 
    updatePreset,
    reorderBookmarkedPresets 
  } = usePresets();
  const [isReordering, setIsReordering] = useState(false);
  const [editingPreset, setEditingPreset] = useState<TimerPreset | null>(null);
  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<TimerPreset | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadPresets();
      return () => {
        setIsReordering(false);
      };
    }, [loadPresets])
  );

  const handleDelete = (preset: TimerPreset) => {
    setPresetToDelete(preset);
    setIsDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (presetToDelete) {
      removePreset(presetToDelete.id);
      setIsDeleteDialogVisible(false);
      setPresetToDelete(null);
    }
  };

  const handleEdit = (preset: TimerPreset) => {
    setEditingPreset(preset);
    setIsSaveDialogVisible(true);
  };

  const handleSavePreset = (name: string, color: string) => {
    if (editingPreset) {
      const updatedPreset = {
        ...editingPreset,
        name,
        color,
      };
      updatePreset(updatedPreset);
      setEditingPreset(null);
    }
    setIsSaveDialogVisible(false);
  };

  const handleMovePreset = (preset: TimerPreset, direction: 'left' | 'right') => {
    const currentIndex = manualPresets.findIndex(p => p.id === preset.id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= manualPresets.length) return;

    const newOrder = [...manualPresets];
    const [movedPreset] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movedPreset);
    reorderBookmarkedPresets(newOrder);
  };

  const renderPresetCard = (preset: TimerPreset, editable: boolean = true) => {
    if (isReordering) {
      return (
        <View key={preset.id} style={styles.presetCard}>
          <PresetCard 
            preset={preset}
            onEdit={editable ? handleEdit : undefined}
            onDelete={editable ? handleDelete : undefined}
            onMove={editable ? handleMovePreset : undefined}
            canMoveLeft={editable && manualPresets.indexOf(preset) > 0}
            canMoveRight={editable && manualPresets.indexOf(preset) < manualPresets.length - 1}
          />
        </View>
      );
    }

    return (
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
  };

  const renderPresetSection = (title: string, items: TimerPreset[], editable: boolean = true) => (
    <View style={localStyles.section}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>{title}</Text>
        {editable && (
          <Pressable 
            style={[localStyles.manageButton, isReordering && localStyles.manageButtonActive]}
          onPress={() => setIsReordering(!isReordering)}
        >
          <Icon name={isReordering ? "check" : "settings"} size={20} color={theme.colors.white} />
          <Text style={localStyles.manageButtonText}>
            {isReordering ? "Terminer" : "Réorganiser"}
            </Text>
          </Pressable>
        )}
      </View>
      <View style={[styles.grid, localStyles.sectionGrid]}>
        {items.map(preset => renderPresetCard(preset, editable))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Timers enregistrés</Text>
      </View>

      <ScrollView style={styles.presetList}>
        {autoPresets.length > 0 && renderPresetSection('Derniers utilisés', autoPresets, false)}
        {manualPresets.length > 0 && renderPresetSection('Enregistrés', manualPresets)}
      </ScrollView>

      <SavePresetDialog
        isVisible={isSaveDialogVisible}
        defaultName={editingPreset?.name || ''}
        defaultColor={editingPreset?.color}
        onClose={() => {
          setIsSaveDialogVisible(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
      />

      <ConfirmDialog
        isVisible={isDeleteDialogVisible}
        title="Supprimer le preset"
        message={`Êtes-vous sûr de vouloir supprimer "${presetToDelete?.name}" ?`}
        onClose={() => {
          setIsDeleteDialogVisible(false);
          setPresetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.small,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
  sectionGrid: {
    paddingHorizontal: theme.spacing.small,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  manageButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  manageButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}); 