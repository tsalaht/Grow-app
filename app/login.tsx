import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';

// Enable RTL for Arabic


export default function LoginScreen() {
  const { setHasCompletedLogin } = useMyAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google login process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'تم تسجيل الدخول بنجاح',
        'مرحباً بك في GrowUp!',
        [
          {
            text: 'متابعة',
            onPress: async () => {
              // Mark login as completed (for current session only)
              setHasCompletedLogin(true);
              // Navigate to main app
              router.replace('/(tabs)' as any);
            },
          },
        ]
      );
    }, 2000);
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
              style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <View style={styles.googleButtonContent}>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>
                  {isLoading ? 'جاري تسجيل الدخول...' : 'المواصلة باستخدام Google'}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.orText}>أو</Text>

            {/* Disabled Login Options */}
            <View style={styles.disabledSection}>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledPlaceholder}>البريد الإلكتروني</Text>
              </View>
              
              <View style={styles.disabledInput}>
                <Text style={styles.disabledPlaceholder}>كلمة المرور</Text>
              </View>

              <TouchableOpacity style={styles.disabledLink}>
                <Text style={styles.disabledLinkText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.disabledLoginButton}>
                <Text style={styles.disabledLoginButtonText}>تسجيل الدخول</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.signupText}>
              ليس لديك حساب؟ إنشاء حساب جديد
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              بتسجيل الدخول، فإنك توافق على شروط الخدمة وسياسة الخصوصية
            </Text>
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
  disabledLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  disabledLinkText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#3B82F6',
  },
  disabledLoginButton: {
    backgroundColor: '#095028',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledLoginButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});