import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { TrendingUp, Flame, Check, Plus, PartyPopper } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  category: string;
  color: string;
}

export default function DailyHabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'شرب 8 أكواب ماء',
      streak: 7,
      completedToday: true,
      category: 'صحة',
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'قراءة 30 دقيقة',
      streak: 12,
      completedToday: true,
      category: 'تعلم',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'ممارسة التأمل',
      streak: 5,
      completedToday: false,
      category: 'روحانية',
      color: '#8B5CF6',
    },
    {
      id: '4',
      title: 'تمرين رياضي',
      streak: 3,
      completedToday: false,
      category: 'رياضة',
      color: '#EF4444',
    },
  ]);
  const [notificationService] = useState(() => NotificationService.getInstance());

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const toggleHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    setHabits(habits.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completedToday: !habit.completedToday,
            streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          }
        : habit
    ));

    // جدولة إشعار العادة إذا تم تفعيلها
    if (!habit.completedToday) {
      try {
        const habitData = {
          id: habit.id,
          title: habit.title,
          reminderTime: '09:00', // وقت افتراضي
        };
        notificationService.scheduleHabitReminder(habitData).catch(error => {
          console.error('خطأ في جدولة إشعار العادة:', error);
        });
      } catch (error) {
        console.error('خطأ في معالجة إشعار العادة:', error);
      }
    }
  };

  const completedHabits = habits.filter(habit => habit.completedToday).length;
  const totalHabits = habits.length;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.title}>العادات اليومية</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedHabits} من {totalHabits} عادات مكتملة اليوم
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: totalHabits > 0 ? `${(completedHabits / totalHabits) * 100}%` : '0%' }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedHabits}</Text>
            <Text style={styles.statLabel}>مكتملة اليوم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.max(...habits.map(h => h.streak))}</Text>
            <Text style={styles.statLabel}>أطول سلسلة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.round((completedHabits / totalHabits) * 100)}%</Text>
            <Text style={styles.statLabel}>معدل الإنجاز</Text>
          </View>
        </View>

        <View style={styles.habitsContainer}>
          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                habit.completedToday && styles.habitCardCompleted
              ]}
              onPress={() => toggleHabit(habit.id)}
            >
              <View style={styles.habitLeft}>
                <View style={[
                  styles.habitIcon,
                  { backgroundColor: habit.color + '20' }
                ]}>
                  <View style={[
                    styles.habitIconInner,
                    { backgroundColor: habit.color }
                  ]}>
                    {habit.completedToday && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
                
                <View style={styles.habitInfo}>
                  <Text style={[
                    styles.habitTitle,
                    habit.completedToday && styles.habitTitleCompleted
                  ]}>
                    {habit.title}
                  </Text>
                  <Text style={styles.habitCategory}>{habit.category}</Text>
                </View>
              </View>

              <View style={styles.habitRight}>
                <View style={styles.streakContainer}>
                  <Flame size={16} color={habit.streak > 0 ? '#F59E0B' : '#D1D5DB'} />
                  <Text style={[
                    styles.streakText,
                    { color: habit.streak > 0 ? '#F59E0B' : '#6B7280' }
                  ]}>
                    {habit.streak}
                  </Text>
                </View>
                <Text style={styles.streakLabel}>يوم متتالي</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.motivationSection}>
          <Text style={styles.motivationTitle}>نصيحة اليوم</Text>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              "العادات الصغيرة تؤدي إلى نتائج كبيرة. كل يوم هو فرصة جديدة لبناء نسخة أفضل من نفسك."
            </Text>
          </View>
        </View>

        {completedHabits === totalHabits && totalHabits > 0 && (
          <View style={styles.celebrationCard}>
            <View style={styles.celebrationIcon}>
              <PartyPopper size={24} color="#F59E0B" />
            </View>
            <Text style={styles.celebrationTitle}>مبروك!</Text>
            <Text style={styles.celebrationText}>
              لقد أكملت جميع عاداتك اليوم. استمر في هذا الإنجاز الرائع!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#095028',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
    textAlign: 'right',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#095028',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  habitsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitCardCompleted: {
    backgroundColor: '#A2E9C1',
    borderWidth: 1,
    borderColor: '#095028',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitIconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'right',
  },
  habitTitleCompleted: {
    color: '#095028',
  },
  habitCategory: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  habitRight: {
    alignItems: 'center',
    gap: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
  },
  streakLabel: {
    fontSize: 10,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  motivationSection: {
    marginBottom: 24,
  },
  motivationTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'right',
  },
  motivationCard: {
    backgroundColor: '#A2E9C1',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#095028',
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
    lineHeight: 22,
    textAlign: 'right',
  },
  celebrationCard: {
    backgroundColor: '#A2E9C1',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#095028',
  },
  celebrationIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  celebrationText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
    textAlign: 'center',
    lineHeight: 20,
  },
});