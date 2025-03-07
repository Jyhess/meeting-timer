import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sliderTrack: {
    width: 50,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    padding: 2,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});