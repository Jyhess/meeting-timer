import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';
import { initAudio } from '../../src/utils/audio';
import { Platform } from 'react-native';

export default function TabLayout() {
  // Initialize audio session on component mount
  useEffect(() => {
    initAudio();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 60 : 50,
          paddingBottom: Platform.OS === 'android' ? 8 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Presets',
          tabBarIcon: ({ color }) => (
            <Icon name="schedule" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => (
            <Icon name="alarm_add" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color }) => (
            <Icon name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}