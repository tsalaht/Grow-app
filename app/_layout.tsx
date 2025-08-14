import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import NotificationService from '@/services/NotificationService';
import { MyAppProvider, useMyAppContext } from '@/context/MyAppContext';
import * as Updates from 'expo-updates';


function RootLayoutContent() {
  const { hasCompletedOnboarding, hasCompletedLogin, isLoading } = useMyAppContext();
  if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
  // Reload so changes apply immediately on first run
  if (Updates?.reloadAsync) {
    Updates.reloadAsync();
  }
}
  const router = useRouter();

  console.log('App State - Onboarding:', hasCompletedOnboarding, 'Login:', hasCompletedLogin);


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

  // Always start with onboarding on app load
  useEffect(() => {
    if (!isLoading) {
      console.log('📍 Always starting with onboarding');
      // Always navigate to onboarding on app start
      router.replace('/onboarding' as any);
    }
  }, [isLoading, router]);

  // Handle navigation during session (after user completes steps)
  useEffect(() => {
    // Don't interfere with initial load
    if (isLoading) return;
    
    // During session, handle navigation based on completion
    if (hasCompletedOnboarding && !hasCompletedLogin) {
      console.log('📍 Session navigation: Going to login');
      // This will be triggered by onboarding completion
    } else if (hasCompletedOnboarding && hasCompletedLogin) {
      console.log('📍 Session navigation: Going to main app');
      // This will be triggered by login completion
    }
  }, [hasCompletedOnboarding, hasCompletedLogin, isLoading]);

  // Show loading screen while determining initial route
  if (isLoading) {
    return null; // This will show a blank screen briefly while loading
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right', // RTL animation
      }}
      initialRouteName="onboarding"
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <MyAppProvider>
      <RootLayoutContent />
      <StatusBar style="auto" />
    </MyAppProvider>
  );
}