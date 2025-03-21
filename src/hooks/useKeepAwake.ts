import { useEffect } from 'react';
import { Platform } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export const useKeepAwake = (shouldKeepAwake: boolean) => {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const activateKeepAwake = async (keepAwake: boolean) => {

        if (keepAwake) {
        await activateKeepAwakeAsync('meeting-timer');
        } else {
        await deactivateKeepAwake('meeting-timer');
        }
    };
    activateKeepAwake(shouldKeepAwake);

    return () => {
      activateKeepAwake(false);
    };
  }, [shouldKeepAwake]);
}; 