import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  presetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 15,
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
  },
  presetTime: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  alertIcons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  alertIcon: {
    opacity: 0.6,
  },
});