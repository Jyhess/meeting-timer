import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';

export default function TabLayout() {
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
    </Tabs>
  );
}
