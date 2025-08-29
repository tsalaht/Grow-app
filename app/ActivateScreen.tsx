import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';
import { AuthApi } from '../services/api/authApi';

export default function ActivateScreen() {
  const { activationToken } = useLocalSearchParams();
  const [activationCode, setActivationCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  useEffect(() => {
    if (!activationToken) {
      Alert.alert('خطأ', 'لم يتم العثور على رمز التنشيط. يرجى إعادة المحاولة.');
      router.back();
    }
  }, [activationToken]);

  const handleActivate = async () => {
    if (!activationCode) {
      Alert.alert('خطأ', 'يرجى إدخال رمز التحقق');
      return;
    }

    setIsActivating(true);
    try {
      console.log('Starting activation attempt with code:', activationCode);

      const activateResponse = await AuthApi.activate({
        activationToken: activationToken as string,
        activationCode,
      });

      console.log('API activate response:', activateResponse);

      // Check for token or success message instead of 'success' field
      if (activateResponse.token) {
        Alert.alert(
          'تم التفعيل بنجاح',
          'مرحباً بك!',
          [{ text: 'متابعة', onPress: () => router.replace('/(tabs)' as any) }]
        );
      } else {
        throw new Error(activateResponse.error || 'Activation failed');
      }
    } catch (error: any) {
      console.error('❌ Activation error:', error);
      Alert.alert('خطأ في التفعيل', error.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsActivating(false);
    }
  };

  const handleBack = () => {
    router.back();
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
            <Text style={styles.subtitle}>تفعيل الحساب</Text>
          </View>

          {/* Activate Card */}
          <View style={styles.registerCard}>
            <Text style={styles.registerTitle}>تفعيل الحساب</Text>

            <TextInput
              style={styles.input}
              placeholder="رمز التحقق"
              placeholderTextColor="#9CA3AF"
              value={activationCode}
              onChangeText={setActivationCode}
              keyboardType="numeric"
              textAlign="right"
              autoFocus={true}
            />
            <TouchableOpacity
              style={[
                styles.registerButton,
                isActivating && styles.buttonDisabled,
              ]}
              onPress={handleActivate}
              disabled={isActivating}
            >
              <Text style={styles.registerButtonText}>
                {isActivating ? 'جاري التفعيل...' : 'تفعيل الحساب'}
              </Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>رجوع</Text>
            </TouchableOpacity>
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
  backButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});