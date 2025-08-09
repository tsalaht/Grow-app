import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Logo from '../Logo';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';

const workTypes = [
  { id: 'marketing', title: 'التسويق' },
  { id: 'business-management', title: 'إدارة الأعمال' },
  { id: 'design', title: 'التصميم' },
  { id: 'video-creation', title: 'صانع فيديوهات' },
  { id: 'education', title: 'التعليم' },
  { id: 'programming', title: 'البرمجة' },
  { id: 'medicine', title: 'الطب' },
  { id: 'engineering', title: 'الهندسة' },
  { id: 'accounting', title: 'المحاسبة' },
  { id: 'law', title: 'القانون' },
  { id: 'sales', title: 'المبيعات' },
  { id: 'hr', title: 'الموارد البشرية' },
  { id: 'journalism', title: 'الصحافة' },
  { id: 'consulting', title: 'الاستشارات' },
  { id: 'real-estate', title: 'العقارات' },
  { id: 'finance', title: 'المالية والمصرفية' },
  { id: 'student', title: 'طالب' },
  { id: 'freelancer', title: 'عمل حر' },
  { id: 'other', title: 'أخرى' },
];

export default function WorkTypeScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useMyAppContext();
  const [selectedWorkType, setSelectedWorkType] = useState<string>('');
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    if (selectedWorkType) {
      // Mark onboarding as completed (for current session only)
      setHasCompletedOnboarding(true);
      // Navigate to login
      router.push('/login' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Logo size="medium" />

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={[styles.questionTitle, { fontFamily: 'Tajawal_700Bold' }]}>
            وش طبيعة عملك؟
          </Text>
          <Text style={[styles.questionSubtitle, { fontFamily: 'Tajawal_400Regular' }]}>
            اختر مجال عملك الحالي
          </Text>
        </View>

        {/* Work Type Options */}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsList}>
            {workTypes.map((workType) => (
              <TouchableOpacity
                key={workType.id}
                style={[
                  styles.optionItem,
                  selectedWorkType === workType.id && styles.selectedOption
                ]}
                onPress={() => setSelectedWorkType(workType.id)}
              >
                <Text style={[
                  styles.optionText,
                  selectedWorkType === workType.id && styles.selectedOptionText,
                  { fontFamily: 'Tajawal_500Medium' }
                ]}>
                  {workType.title}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedWorkType === workType.id && styles.selectedRadio
                ]}>
                  {selectedWorkType === workType.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !selectedWorkType && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!selectedWorkType}
        >
          <Text style={[styles.nextButtonText, { fontFamily: 'Tajawal_700Bold' }]}>ابدأ الرحلة</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 80,
  },
  questionTitle: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedOption: {
    backgroundColor: '#12A150',
    borderColor: '#12A150',
    shadowColor: '#12A150',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'right',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#ffffff',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  nextButton: {
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
    marginTop: 32,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    // fontWeight: 'bold',
  },
});