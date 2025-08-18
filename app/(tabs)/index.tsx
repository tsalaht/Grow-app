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
  RefreshControl,
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
  ChevronLeft,
  LogOut
} from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { useMyAppContext } from '@/context/MyAppContext';
import { useRouter } from 'expo-router';
import Logo from '../Logo';
import { 
  useTasks, 
  useGoals, 
  useFinanceOverview, 
  useUnreadNotificationsCount,
  useToggleTask,
  useAddGoalAmount
} from '../../hooks/useApiData';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  backgroundColor: string;
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  icon, 
  content, 
  backgroundColor,
  onPress,
}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, { backgroundColor }]}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      {content}
    </View>
  </TouchableOpacity>
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
  const { username, logout, isAuthenticated } = useMyAppContext();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // API data hooks
  const { data: tasks, loading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { data: goals, loading: goalsLoading, refetch: refetchGoals } = useGoals();
  const { data: financeOverview, loading: financeLoading, refetch: refetchFinance } = useFinanceOverview('2024-01');
  const { data: unreadCount, loading: notificationsLoading, refetch: refetchNotifications } = useUnreadNotificationsCount();
  
  // Mutation hooks
  const { mutate: toggleTask, loading: toggleLoading } = useToggleTask();
  const { mutate: addGoalAmount, loading: addAmountLoading } = useAddGoalAmount();

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  const handleAddGoal = () => {
    router.push('/add-goal' as any);
  };

  const handleViewFinance = () => {
    router.push('/finance' as any);
  };

  const handleViewTasks = () => {
    router.push('/daily-goals' as any);
  };

  const handleViewGoals = () => {
    router.push('/big-goals' as any);
  };

  const handleViewNotes = () => {
    router.push('/smart-notes' as any);
  };

  const handleViewNotifications = () => {
    router.push('/notifications' as any);
  };

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchTasks(),
      refetchGoals(),
      refetchFinance(),
      refetchNotifications(),
    ]);
    setRefreshing(false);
  };

  const handleToggleTask = async (taskId: string) => {
    const result = await toggleTask(taskId);
    if (result.success) {
      refetchTasks();
    } else {
      Alert.alert('خطأ', 'فشل في تحديث المهمة');
    }
  };

  const handleAddAmount = async (goalId: string, amount: number) => {
    const result = await addGoalAmount({ id: goalId, amount });
    if (result.success) {
      refetchGoals();
    } else {
      Alert.alert('خطأ', 'فشل في إضافة المبلغ');
    }
  };

  // Calculate dashboard metrics
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const totalTasks = tasks?.length || 0;
  const completedGoals = goals?.filter(goal => goal.progress >= 100).length || 0;
  const totalGoals = goals?.length || 0;
  const currentMonthIncome = financeOverview?.totalIncome || 0;
  const currentMonthExpenses = financeOverview?.totalExpenses || 0;
  const remainingAmount = financeOverview?.remainingAmount || 0;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.notificationButton} 
              onPress={handleViewNotifications}
            >
              <Bell size={24} color="#095028" />
              {unreadCount && unreadCount.count > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount.count > 99 ? '99+' : unreadCount.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {isAuthenticated && (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.dashboardGrid}>
          {/* Tasks Card */}
          <DashboardCard
            title="المهام اليومية"
            icon={<Activity size={24} color="#FFFFFF" />}
            backgroundColor="#3B82F6"
            onPress={handleViewTasks}
            content={
              <View style={styles.cardContentInner}>
                <Text style={styles.cardNumber}>{completedTasks}/{totalTasks}</Text>
                <ProgressBar progress={completedTasks} total={totalTasks} />
                <Text style={styles.cardSubtext}>مهام مكتملة</Text>
              </View>
            }
          />

          {/* Goals Card */}
          <DashboardCard
            title="الأهداف الكبيرة"
            icon={<Target size={24} color="#FFFFFF" />}
            backgroundColor="#10B981"
            onPress={handleViewGoals}
            content={
              <View style={styles.cardContentInner}>
                <Text style={styles.cardNumber}>{completedGoals}/{totalGoals}</Text>
                <ProgressBar progress={completedGoals} total={totalGoals} />
                <Text style={styles.cardSubtext}>أهداف محققة</Text>
              </View>
            }
          />

          {/* Finance Card */}
          <DashboardCard
            title="المالية"
            icon={<CreditCard size={24} color="#FFFFFF" />}
            backgroundColor="#F59E0B"
            onPress={handleViewFinance}
            content={
              <View style={styles.cardContentInner}>
                <Text style={styles.cardNumber}>${remainingAmount.toFixed(0)}</Text>
                <Text style={styles.cardSubtext}>المتبقي هذا الشهر</Text>
                <View style={styles.financeDetails}>
                  <Text style={styles.financeDetail}>الدخل: ${currentMonthIncome.toFixed(0)}</Text>
                  <Text style={styles.financeDetail}>المصروفات: ${currentMonthExpenses.toFixed(0)}</Text>
                </View>
              </View>
            }
          />

          {/* Notes Card */}
          <DashboardCard
            title="الملاحظات الذكية"
            icon={<Brain size={24} color="#FFFFFF" />}
            backgroundColor="#8B5CF6"
            onPress={handleViewNotes}
            content={
              <View style={styles.cardContentInner}>
                <Text style={styles.cardNumber}>+</Text>
                <Text style={styles.cardSubtext}>إضافة ملاحظة جديدة</Text>
              </View>
            }
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddGoal}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>إضافة هدف</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleViewTasks}>
              <Eye size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>عرض المهام</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>النشاط الأخير</Text>
          <View style={styles.activityList}>
            {tasksLoading ? (
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            ) : tasks && tasks.length > 0 ? (
              tasks.slice(0, 3).map((task) => (
                <TouchableOpacity 
                  key={task.id} 
                  style={styles.activityItem}
                  onPress={() => handleToggleTask(task.id)}
                  disabled={toggleLoading}
                >
                  <View style={styles.activityIcon}>
                    <Activity size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{task.title}</Text>
                    <Text style={styles.activityStatus}>
                      {task.status === 'completed' ? 'مكتملة' : 'قيد التنفيذ'}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#6B7280" />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>لا توجد مهام حديثة</Text>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  username: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
  },
  logoutButton: {
    padding: 8,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
    gap: 16,
  },
  card: {
    width: '48%', // Two cards per row
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
  cardContent: {
    // flex: 1, // This is now handled by cardContentInner
  },
  cardContentInner: {
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 36,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#E5E7EB',
  },
  financeDetails: {
    marginTop: 12,
    width: '100%',
  },
  financeDetail: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#095028',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  activityStatus: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
     emptyText: {
     fontSize: 16,
     fontFamily: 'Tajawal_400Regular',
     color: '#6B7280',
     textAlign: 'center',
     paddingVertical: 20,
   },
   // Progress bar styles
   progressContainer: {
     gap: 8,
     marginTop: 8,
   },
   progressBar: {
     height: 8,
     backgroundColor: 'rgba(255, 255, 255, 0.3)',
     borderRadius: 4,
     overflow: 'hidden',
     flexDirection: 'row-reverse', 
   },
   progressFill: {
     height: '100%',
     backgroundColor: '#FFFFFF',
     borderRadius: 4,
   },
   progressText: {
     fontSize: 12,
     fontFamily: 'Tajawal_400Regular',
     color: '#E5E7EB',
     textAlign: 'right',
   },
 });