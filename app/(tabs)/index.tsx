import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Target, 
  TrendingUp, 
  CreditCard, 
  Brain, 
  Trophy, 
  Activity,
  Plus,
  Eye,
  ChevronRight,
  Dumbbell,
  Bell,
  User,
} from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';
import { useRouter } from 'expo-router';
import Logo from '../Logo';

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  backgroundColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  content, 
  backgroundColor 
}) => (
  <View style={[styles.card, { backgroundColor }]}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      {content}
    </View>
  </View>
);

const ProgressBar: React.FC<{ progress: number; total: number }> = ({ progress, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View 
        style={[
          styles.progressFill, 
          { width: `${(progress / total) * 100}%` }
        ]} 
      />
    </View>
    <Text style={styles.progressText}>{progress} / {total} مكتملة</Text>
  </View>
);

export default function HomeScreen() {
  const { username } = useMyAppContext();
  const [dailySpending] = useState(25.50);
  const [habitsProgress] = useState({ completed: 2, total: 4 });

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  const handleAddGoal = () => {
    Alert.alert('إضافة هدف', 'سيتم إضافة هدف جديد');
  };

  const handleViewFinance = () => {
    Alert.alert('المالية', 'عرض تفاصيل المصاريف');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#A2E9C1", "#A2E9C1"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => router.push('/profile')} style={styles.iconButton}>
                <User size={22} color="#12A150" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconButton}>
                <Bell size={22} color="#12A150" />
              </TouchableOpacity>
            </View>
            <Logo/>
            {/* <Text style={styles.appTitle}>نمو</Text> */}
          </View>
          {/* <Text style={styles.greeting}>{getGreeting()}، {username}</Text> */}
        </LinearGradient>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {/* Daily Goals Card */}
          <DashboardCard
            title="أهدافي"
            icon={<Target size={20} color="#EF4444" />}
            backgroundColor="#E0F2FE"
            content={
              <View style={styles.goalsContent}>
                <Text style={styles.goalsSubtext}>لا توجد أهداف اليوم</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>إضافة</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Daily Habits Card */}
          <DashboardCard
            title="العادات اليومية"
            icon={<TrendingUp size={20} color="#10B981" />}
            backgroundColor="#D1FAE5"
            content={
              <View style={styles.habitsContent}>
                <ProgressBar 
                  progress={habitsProgress.completed} 
                  total={habitsProgress.total} 
                />
                <TouchableOpacity style={styles.followButton}>
                  <TrendingUp size={14} color="#6B7280" />
                  <Text style={styles.followButtonText}>تتبع</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Finance Card */}
          <DashboardCard
            title="المالية"
            icon={<CreditCard size={20} color="#F59E0B" />}
            backgroundColor="#FEF3C7"
            content={
              <View style={styles.financeContent}>
                <Text style={styles.financeAmount}>
                  تم إنفاق <Text style={styles.amount}>{dailySpending} رس</Text> اليوم
                </Text>
                <TouchableOpacity style={styles.viewButton} onPress={handleViewFinance}>
                  <Eye size={14} color="#FFFFFF" />
                  <Text style={styles.viewButtonText}>عرض</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Life Activities Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>أنشطة الحياة</Text>
          </View>

          <TouchableOpacity style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <Dumbbell size={20} color="#8B5CF6" />
              <Text style={styles.activityText}>تمرين رياضي</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickActionCard, styles.smartNotesCard]}>
              <Brain size={24} color="#EC4899" />
              <Text style={styles.quickActionTitle}>الملاحظات الذكية</Text>
              <Text style={styles.quickActionSubtitle}>تدوين الأفكار والملاحظات</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickActionCard, styles.bigGoalsCard]}>
              <Trophy size={24} color="#F59E0B" />
              <Text style={styles.quickActionTitle}>أهدافي الكبيرة</Text>
              <Text style={styles.quickActionSubtitle}>الأهداف طويلة المدى</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    display: 'none', // Hide old header
  },
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginRight: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  appTitle: {
    fontSize: 26,
    fontFamily: 'Tajawal_700Bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#fff',
    textAlign: 'right',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  cardContent: {
    flex: 1,
  },
  goalsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalsSubtext: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
  },
  habitsContent: {
    gap: 8,
  },
  progressContainer: {
    gap: 8,
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
  progressText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#A2E9C1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  followButtonText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
  },
  financeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeAmount: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
  amount: {
    fontFamily: 'Tajawal_700Bold',
    color: '#DC2626',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  smartNotesCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#095028',
  },
  bigGoalsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#A2E9C1',
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});