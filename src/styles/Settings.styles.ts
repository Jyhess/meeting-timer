import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.medium,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.xlarge,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginBottom: theme.spacing.medium,
  },
  durationContainer: {
    borderRadius: theme.borders.radius.medium,
    //padding: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'flex-start',
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.small,
    flex: 1,
    marginRight: 16,
  },
  durationInput: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    width: 80,
    textAlign: 'center',
  },
  durationUnit: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginLeft: theme.spacing.small,
  },
  durationControls: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundsList: {
    width: '100%',
    gap: 12,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray.dark,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  soundControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  soundName: {
    color: theme.colors.white,
    fontSize: 16,
    flex: 1,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.medium,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borders.radius.medium,
  },
  legalLinkText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.white,
  },
});