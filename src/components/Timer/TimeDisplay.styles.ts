import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  prefixContainer: {
    position: 'relative',
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  prefix: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'right',
  },
}); 