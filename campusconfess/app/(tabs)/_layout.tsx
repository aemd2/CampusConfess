/**
 * Tabs Layout (Main App)
 * 
 * Bottom tab navigation for the main app screens:
 * - feed → Home feed with confessions
 * - post → Create new confession
 * - profile → User settings & preferences
 */

import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background.secondary,
          borderTopColor: Colors.border.default,
        },
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor: Colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: () => '📱',
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'Post',
          tabBarIcon: () => '✍️',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => '⚙️',
        }}
      />
    </Tabs>
  );
}
