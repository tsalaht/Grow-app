import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useFonts, Tajawal_400Regular } from '@expo-google-fonts/tajawal';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#095028',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="daily-goals"
        options={{
          title: 'الأهداف اليومية',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>🎯</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="daily-habits"
        options={{
          title: 'العادات اليومية',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>📈</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'المالية',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>💳</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="big-goals"
        options={{
          title: 'أهدافي الكبيرة',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>🏆</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="smart-notes"
        options={{
          title: 'الملاحظات الذكية',
          tabBarIcon: ({ size, color }) => (
            <Text style={{ fontSize: size }}>🧠</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
  },
  tabBarLabel: {
    fontFamily: 'Tajawal_400Regular',
    fontSize: 11,
    fontWeight: '400',
  },
});