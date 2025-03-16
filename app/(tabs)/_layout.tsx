import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';
import { Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';

function TimerTab() {
  const router = useRouter();
  
  return (
    <Pressable 
      onPress={() => {
        router.push({
          pathname: "/timer",
          params: { presetId: null }
        });
      }}
    >
      <Icon name="alarm_add" size={24} color={theme.colors.white} />
    </Pressable>
  );
}

export default function TabLayout() {
  // Initialize audio session on component mount
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.background.secondary,
          height: Platform.OS === 'android' ? 60 : 50,
          paddingBottom: Platform.OS === 'android' ? 8 : 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
      }}
      initialRouteName="timer"
    >
      <Tabs.Screen
        name="presets"
        options={{
          title: 'Presets',
          tabBarIcon: ({ color }) => <Icon name="schedule" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: () => <TimerTab />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color }) => <Icon name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}