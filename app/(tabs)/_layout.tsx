import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';
import { initAudio } from '../../src/utils/audio';

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
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
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