import { StyleSheet } from 'react-native';
import { theme } from '../theme';

const headerHeight = 76; // 20px padding top + 36px contenu + 20px padding bottom
const cardGap = 10;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: headerHeight,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
  },
  newButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
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
    color: theme.colors.disabled,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.medium,
  },
  emptyStateSubtext: {
    color: theme.colors.disabled,
    fontSize: theme.typography.fontSize.medium,
    textAlign: 'center',
    marginTop: theme.spacing.small,
  },
  grid: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: cardGap,
  },
  presetCard: {
    borderRadius: theme.borders.radius.medium,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  alertIcon: {
    opacity: 0.6,
  },
});