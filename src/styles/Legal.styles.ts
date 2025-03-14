import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.background.primary,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.medium,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.tertiary,
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  text: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.gray.light,
    lineHeight: 24,
    marginBottom: theme.spacing.small,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    marginBottom: theme.spacing.medium,
  },
  linkText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.primary,
    lineHeight: 24,
    marginRight: theme.spacing.small,
  },
  closeButton: {
    padding: theme.spacing.small,
    marginRight: theme.spacing.small,
  },
}); 