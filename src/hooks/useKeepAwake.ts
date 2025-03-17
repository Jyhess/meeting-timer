import { useEffect } from 'react';
import { Platform } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export const useKeepAwake = (shouldKeepAwake: boolean) => {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const activateKeepAwake = async (keepAwake: boolean) => {

        if (keepAwake) {
        await activateKeepAwakeAsync('coach-timer');
        } else {
        await deactivateKeepAwake('coach-timer');
        }
    };
    activateKeepAwake(shouldKeepAwake);

    return () => {
      activateKeepAwake(false);
    };
  }, [shouldKeepAwake]);
}; 