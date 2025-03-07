import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

export default function TabLayout() {
  // Initialize audio session on component mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting up audio mode:', error);
      }
    };
    
    setupAudio();
    
    return () => {
      // Clean up audio session on unmount if needed
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      }).catch(error => {
        console.error('Error cleaning up audio mode:', error);
      });
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        // Improve performance by not re-rendering screens when switching tabs
        unmountOnBlur: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timers',
          tabBarIcon: ({ size, color }) => (
            <Icon name="schedule" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Nouveau',
          tabBarIcon: ({ size, color }) => (
            <Icon name="add_circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Préférences',
          tabBarIcon: ({ size, color }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}