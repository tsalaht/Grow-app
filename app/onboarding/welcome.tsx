import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Logo from '../Logo';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

export default function WelcomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Logo showSubtitle />

        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <Text style={[styles.welcomeTitle, { fontFamily: 'Tajawal_700Bold' }]}>
            مرحباً بك في نسخة جديدة{'\n'}
            نسخة أفضل من نفسك
          </Text>
          
          <Text style={[styles.welcomeSubtitle, { fontFamily: 'Tajawal_400Regular' }]}>
            جاهز تبني عادات أقوى وتحقق أهدافك؟{'\n'}
            الطموح ما له حدود، والنجاح يبدأ من هنا{'\n'}
            خلنا نبدأ رحلة التغيير سوا
          </Text>
          
          <Text style={[styles.motivationalText, { fontFamily: 'Tajawal_500Medium' }]}>
            "اللي ما يطور نفسه، الزمن يتجاوزه"
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/onboarding/interests')}
        >
          <Text style={[styles.startButtonText, { fontFamily: 'Tajawal_700Bold' }]}>ابدأ</Text>
          <ArrowRight size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1fae5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    // fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 32,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  motivationalText: {
    fontSize: 14,
    color: '#12A150',
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12A150',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#12A150',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    // fontWeight: 'bold',
  },
});