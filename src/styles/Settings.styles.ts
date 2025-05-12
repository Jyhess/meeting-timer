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
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
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
  languageContainer: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  languageButton: {
    flex: 1,
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  languageText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.white,
  },
  languageTextActive: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  durationContainer: {
    borderRadius: theme.borders.radius.medium,
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
    gap: theme.spacing.small,
  },
  soundsList: {
    width: '100%',
    gap: theme.spacing.small,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray.dark,
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    width: '100%',
    justifyContent: 'space-between',
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    flex: 1,
  },
  soundControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  soundName: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.medium,
    flex: 1,
  },
  playButton: {
    width: theme.layout.iconSize,
    height: theme.layout.iconSize,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  versionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.medium,
    marginBottom: theme.spacing.medium,
  },
  versionText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
  },
  copyButton: {
    position: 'absolute',
    right: theme.spacing.small,
    top: theme.spacing.small,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    borderRadius: theme.borders.radius.medium,
    gap: theme.spacing.small,
  },
});