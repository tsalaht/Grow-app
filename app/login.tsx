import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
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
import NotificationService from '@/services/NotificationService';

export default function LoginScreen() {
  const { login, isLoading } = useMyAppContext();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoggingIn(true);
    try {
      console.log('Starting login attempt with email:', email);

      // Get FCM token for notifications
      let fcmToken = '';
      try {
        const fcmResult =
          await NotificationService.getInstance().registerForPushNotifications();
        fcmToken = fcmResult || '';
        console.log('FCM token obtained:', fcmToken);
      } catch (fcmError) {
        console.warn('⚠️ FCM token error (continuing without it):', fcmError);
      }

      // Use context login function
      const loginSuccess = await login(email, password, fcmToken);

      if (loginSuccess) {
        console.log('✅ Login successful, navigating to main app');
        // The context will handle the navigation automatically
        // No need to manually navigate here
      } else {
        Alert.alert(
          'خطأ في تسجيل الدخول',
          'البريد الإلكتروني أو كلمة المرور غير صحيحين'
        );
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      let errorMessage = 'حدث خطأ غير متوقع.';

      if (error.message && error.message.includes('Invalid credentials')) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحين.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('خطأ في تسجيل الدخول', errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    // For now, show alert; in full implementation, navigate to forgot password screen
    Alert.alert(
      'نسيت كلمة المرور',
      'سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.'
    );
  };

  const handleSignUp = () => {
    // TODO: Navigate to sign up screen
    // For now, show alert; in full implementation, router.push('/signup')
    // Alert.alert('إنشاء حساب', 'سيتم توجيهك إلى شاشة إنشاء حساب جديد.');
    router.push('/RegisterScreen');
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

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (isLoading || isLoggingIn) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading || isLoggingIn}
            >
              <Text style={styles.loginButtonText}>
                {isLoading || isLoggingIn
                  ? 'جاري تسجيل الدخول...'
                  : 'تسجيل الدخول'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>هل نسيت كلمة المرور؟</Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <View style={styles.signUpSection}>
              <Text style={styles.signUpText}>ليس لديك حساب؟ </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.linkText}>إنشاء حساب جديد</Text>
              </TouchableOpacity>
            </View>

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
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#095028',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 16,
  },
  signUpSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
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
    fontFamily: 'Tajawal_400Regular',
  },
});
