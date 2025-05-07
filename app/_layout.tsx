import 'react-native-gesture-handler';
import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, AppState, AppStateStatus, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { TimerProvider } from '../src/contexts/TimerContext';
import { AudioProvider } from '../src/contexts/AudioProvider';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  // Handle app state changes to properly clean up resources
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App is going to background, clean up resources if needed
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.frameworkReady?.();
    }
    
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // Clean up the subscription
      subscription?.remove();
    };
  }, [handleAppStateChange]);

  // On web, nous n'avons pas besoin de GestureHandlerRootView
  const Container = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AudioProvider>
          <TimerProvider>
            <StatusBar style="light" />
            <Container style={styles.container}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </Container>
          </TimerProvider>
        </AudioProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
