import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { useTranslation } from '../../hooks/useTranslation';
import { ClickButton } from '../common/ClickButton';

type ConfirmDialogProps = {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmDialog = ({
  isVisible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <ClickButton
              label={cancelText || t('common.cancel')}
              onPress={onClose}
              variant="default"
            />
            <ClickButton
              label={confirmText || t('common.confirm')}
              onPress={onConfirm}
              variant="danger"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.large,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.medium,
  },
}); 