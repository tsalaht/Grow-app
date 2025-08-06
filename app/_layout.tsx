import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import NotificationService from '@/services/NotificationService';
import { MyAppProvider } from '@/context/MyAppContext';

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // تهيئة نظام الإشعارات عند بدء التطبيق
    const initNotifications = async () => {
      try {
        const notificationService = NotificationService.getInstance();
        await notificationService.registerForPushNotifications();
        NotificationService.setupNotificationHandler();
      } catch (error) {
        console.error('خطأ في تهيئة الإشعارات:', error);
        // Continue without notifications for now
      }
    };
    
    // Temporarily disable notifications to avoid errors
    // initNotifications();
  }, []);

  return (
    <MyAppProvider>
      <Stack 
        initialRouteName="login"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right', // RTL animation
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </MyAppProvider>
  );
}