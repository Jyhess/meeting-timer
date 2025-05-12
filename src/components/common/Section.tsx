import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export const Section = ({ title, description, children, style }: SectionProps) => {
  return (
    <View style={[styles.section, style]}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: theme.spacing.medium,
  },
  title: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  description: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginBottom: theme.spacing.medium,
  },
}); 