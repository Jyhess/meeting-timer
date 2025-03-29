import { StyleSheet } from 'react-native';
import { theme } from '../theme';

const headerHeight = 76; // 20px padding top + 36px contenu + 20px padding bottom
const cardGap = 10;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
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
  presetList: {
    flex: 1,
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
});