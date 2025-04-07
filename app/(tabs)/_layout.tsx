import { Tabs } from 'expo-router';
import { Icon } from '../../src/components/Timer/Icon';
import { Platform } from 'react-native';
import { theme } from '../../src/theme';
import { useTranslation } from '../../src/hooks/useTranslation';

export default function TabLayout() {
  const { t } = useTranslation();
  
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
          title: t('common.presets'),
          tabBarIcon: ({ color }) => <Icon name="bookmarks" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: t('common.timer'),
          tabBarIcon: ({ color }) => <Icon name="alarm_add" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('common.preferences'),
          tabBarIcon: ({ color }) => <Icon name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}