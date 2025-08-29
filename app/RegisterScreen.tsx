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
import { AuthApi } from '../services/api/authApi';
import NotificationService from '@/services/NotificationService';

export default function RegisterScreen() {
  const { login, isLoading } = useMyAppContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      console.log('Starting register attempt with email:', email);

      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('يرجى ملء جميع الحقول');
      }
      if (password !== confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('البريد الإلكتروني غير صالح');
      }
      if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      // Optional: Get FCM token
      let fcmToken = '';
      try {
        const fcmResult = await NotificationService.getInstance().registerForPushNotifications();
        fcmToken = fcmResult || '';
        console.log('FCM token obtained:', fcmToken);
      } catch (fcmError) {
        console.warn('⚠️ FCM token error (continuing without it):', fcmError);
      }

      // Actual API call
      const registerResponse = await AuthApi.register({
        name,
        email,
        password,
        fcmToken,
      });

      console.log('API register response:', registerResponse);

      if (registerResponse.success && registerResponse.activationToken) {
        router.push({
          pathname: '/ActivateScreen',
          params: { activationToken: registerResponse.activationToken },
        });
      } else {
        throw new Error(registerResponse.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      let errorMessage = 'حدث خطأ غير متوقع.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('خطأ في إنشاء الحساب', errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
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
            <Text style={styles.subtitle}>نمو وتفعيل ذاتي</Text>
          </View>

          {/* Register Card */}
          <View style={styles.registerCard}>
            <Text style={styles.registerTitle}>إنشاء حساب جديد</Text>

            <TextInput
              style={styles.input}
              placeholder="الاسم"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textAlign="right"
            />
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
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />
            <TextInput
              style={styles.input}
              placeholder="تأكيد كلمة المرور"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textAlign="right"
            />
            <TouchableOpacity
              style={[
                styles.registerButton,
                (isLoading || isRegistering) && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading || isRegistering}
            >
              <Text style={styles.registerButtonText}>
                {isLoading || isRegistering ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Text>
            </TouchableOpacity>

            {/* Login Redirect */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>لديك حساب بالفعل؟ </Text>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={styles.linkText}>تسجيل الدخول</Text>
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
  registerCard: {
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
  registerTitle: {
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
  registerButton: {
    backgroundColor: '#095028',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginText: {
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