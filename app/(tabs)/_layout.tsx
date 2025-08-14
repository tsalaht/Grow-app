import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
import { Home, Target, TrendingUp, CreditCard, Trophy, Brain } from 'lucide-react-native';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#12A150',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>




      <Tabs.Screen
        name="smart-notes"
        options={{
          title: 'الملاحظات الذكية',
          tabBarIcon: ({ size, color, focused }) => (
            <Brain size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="big-goals"
        options={{
          title: 'أهدافي الكبيرة',
          tabBarIcon: ({ size, color, focused }) => (
            <Trophy size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
            <Tabs.Screen
        name="finance"
        options={{
          title: 'المالية',
          tabBarIcon: ({ size, color, focused }) => (
            <CreditCard size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
            <Tabs.Screen
        name="daily-goals"
        options={{
          title: 'المهام',
          tabBarIcon: ({ size, color, focused }) => (
            <Target size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
            <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ size, color, focused }) => (
            <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
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
    flexDirection: 'row-reverse',
  },
  tabBarLabel: {
    fontFamily: 'Tajawal_400Regular',
    fontSize: 11,
    fontWeight: '400',
  },
});