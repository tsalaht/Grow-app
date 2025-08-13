import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, DollarSign, Brain, Users, Heart, Flower, Monitor, Rocket, BookOpen, Palette, Trophy, ChefHat, Plane, Book, Music, Camera } from 'lucide-react-native';
import Logo from '../Logo';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

const interests = [
  { id: 'financial', title: 'مالي', icon: <DollarSign size={24} color="#10B981" /> },
  { id: 'self-development', title: 'تطوير ذاتي', icon: <Brain size={24} color="#8B5CF6" /> },
  { id: 'social', title: 'اجتماعي', icon: <Users size={24} color="#3B82F6" /> },
  { id: 'health', title: 'صحي', icon: <Heart size={24} color="#EF4444" /> },
  { id: 'psychological', title: 'نفسي', icon: <Flower size={24} color="#EC4899" /> },
  { id: 'technology', title: 'تقني', icon: <Monitor size={24} color="#6B7280" /> },
  { id: 'entrepreneurship', title: 'ريادة أعمال', icon: <Rocket size={24} color="#F59E0B" /> },
  { id: 'education', title: 'تعليمي', icon: <BookOpen size={24} color="#095028" /> },
  { id: 'creative', title: 'إبداعي', icon: <Palette size={24} color="#8B5CF6" /> },
  { id: 'sports', title: 'رياضي', icon: <Trophy size={24} color="#F59E0B" /> },
  { id: 'cooking', title: 'طبخ', icon: <ChefHat size={24} color="#EF4444" /> },
  { id: 'travel', title: 'سفر', icon: <Plane size={24} color="#3B82F6" /> },
  { id: 'reading', title: 'قراءة', icon: <Book size={24} color="#095028" /> },
  { id: 'music', title: 'موسيقى', icon: <Music size={24} color="#EC4899" /> },
  { id: 'photography', title: 'تصوير', icon: <Camera size={24} color="#6B7280" /> },
];

export default function InterestsScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  if (!fontsLoaded) {
    return null;
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length > 0) {
      router.push('/onboarding/work-type');
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
            وش أكثر مجال يهمك؟
          </Text>
          <Text style={[styles.questionSubtitle, { fontFamily: 'Tajawal_400Regular' }]}>
            اختر المجالات التي تود التركيز عليها
          </Text>
        </View>

        {/* Interest Options */}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsGrid}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.optionCard,
                  selectedInterests.includes(interest.id) && styles.selectedOption
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                {interest.icon}
                <Text style={[
                  styles.optionText,
                  selectedInterests.includes(interest.id) && styles.selectedOptionText,
                  { fontFamily: 'Tajawal_500Medium' }
                ]}>
                  {interest.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity 
          style={[
            styles.nextButton,
            selectedInterests.length === 0 && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={selectedInterests.length === 0}
        >
          <Text style={[styles.nextButtonText, { fontFamily: 'Tajawal_700Bold' }]}>التالي</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 20,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  optionCard: {
    width: '47%',
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
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
  optionIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#ffffff',
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