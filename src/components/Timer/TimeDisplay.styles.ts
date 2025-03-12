import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  prefixContainer: {
    position: 'relative',
    left: 0,
    top: 0,
    bottom: 0,
    width: 0,
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