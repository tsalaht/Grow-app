import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { AuthApi } from '../services/api/authApi';
import NotificationService from '@/services/NotificationService';
import { auth, GoogleAuthProvider } from '../firebaseConfig'; // Adjust the import path as needed
import { signInWithCredential } from 'firebase/auth';

// Enable RTL for Arabic
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login, isLoading } = useMyAppContext();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '612098820148-p8vr2kcg1ir3idtfols8u1o5lcrlut5j.apps.googleusercontent.com',
    androidClientId:
      '612098820148-gnqvhdljuv5824dcdh6oihvh4uu8gpct.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('✅ ID Token from Google:', id_token);

      if (id_token) {
        handleGoogleLogin(id_token);
      } else {
        Alert.alert('خطأ', 'لم يتم استلام ID Token من Google');
      }
    }
  }, [response]);

const handleGoogleLogin = async (idToken: string) => {
  setIsLoggingIn(true);
  try {
    // Create Firebase credential with Google ID token
    const credential = GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with the credential
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    console.log('✅ Logged in Firebase user:', user.email);

    // Get FCM token for notifications
    const fcmToken = await NotificationService.getInstance().registerForPushNotifications();

    // Call your backend API to handle Google login
    const loginResponse = await AuthApi.loginWithGoogle(idToken, fcmToken || '');

    // Show success alert and navigate to the tabs screen
    Alert.alert(
      'تم تسجيل الدخول بنجاح',
      `مرحباً ${user.displayName || 'بك'}!`,
      [{ text: 'متابعة', onPress: () => router.replace('/(tabs)' as any) }]
    );
  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'حدث خطأ غير متوقع.';
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'بيانات تسجيل الدخول غير صالحة. حاول مرة أخرى.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'فشل الاتصال بالإنترنت. تحقق من اتصالك.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    Alert.alert('خطأ', errorMessage);
  } finally {
    setIsLoggingIn(false);
  }
};

  const handleGoogleLoginPress = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error prompting Google login:', error);
      Alert.alert(
        'خطأ في تسجيل الدخول',
        'لا يمكن الاتصال بخدمة Google. يرجى المحاولة مرة أخرى.',
        [{ text: 'حسناً' }]
      );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#A2E9C1', '#D1FAE5', '#F0FDF4']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>GrowUp</Text>
              <View style={styles.logoIcon}>
                <Sprout size={24} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.subtitle}>نمو وتطوير ذاتي</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>تسجيل الدخول</Text>

            <TouchableOpacity
              style={[
                styles.googleButton,
                (isLoading || isLoggingIn) && styles.googleButtonDisabled,
              ]}
              onPress={handleGoogleLoginPress}
              disabled={isLoading || isLoggingIn}
            >
              <View style={styles.googleButtonContent}>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>
                  {isLoading || isLoggingIn
                    ? 'جاري تسجيل الدخول...'
                    : 'المواصلة باستخدام Google'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Terms and Privacy */}
            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                بالاستمرار، أنت توافق على{' '}
                <Text style={styles.linkText}>شروط الاستخدام</Text> و{' '}
                <Text style={styles.linkText}>سياسة الخصوصية</Text>
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#095028',
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 30,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  orText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 16,
  },
  disabledSection: {
    opacity: 0.5,
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  disabledPlaceholder: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  disabledButton: {
    backgroundColor: '#095028',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  termsSection: {
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});
