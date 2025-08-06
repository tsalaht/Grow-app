import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  I18nManager,
} from 'react-native';
import { Bell, BellOff, Settings, Trash2, Clock, Calendar, DollarSign, Target, TrendingUp, Brain, Plus, Check, X } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import * as Notifications from 'expo-notifications';
import NotificationService from '@/services/NotificationService';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'finance' | 'tasks' | 'habits' | 'goals' | 'notes' | 'general';
  color: string;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  nextTriggerDate: Date | null;
  category: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    // الإشعارات المالية
    {
      id: 'monthly-income',
      title: 'تذكير الراتب الشهري',
      description: 'إشعار في أول كل شهر لإدخال الراتب',
      icon: <DollarSign size={20} color="#10B981" />,
      enabled: true,
      category: 'finance',
      color: '#10B981',
    },
    {
      id: 'commitment-reminders',
      title: 'تذكير الالتزامات المالية',
      description: 'إشعار قبل موعد دفع الالتزامات بيوم',
      icon: <Calendar size={20} color="#F59E0B" />,
      enabled: true,
      category: 'finance',
      color: '#F59E0B',
    },
    {
      id: 'expense-warnings',
      title: 'تحذير المصروفات',
      description: 'إشعار عند تجاوز 50% من الراتب',
      icon: <Bell size={20} color="#EF4444" />,
      enabled: true,
      category: 'finance',
      color: '#EF4444',
    },
    
    // إشعارات المهام
    {
      id: 'daily-tasks',
      title: 'المهام اليومية',
      description: 'تذكير بالمهام اليومية في الأوقات المحددة',
      icon: <Clock size={20} color="#3B82F6" />,
      enabled: true,
      category: 'tasks',
      color: '#3B82F6',
    },
    {
      id: 'weekly-tasks',
      title: 'المهام الأسبوعية',
      description: 'تذكير بالمهام الأسبوعية',
      icon: <Calendar size={20} color="#8B5CF6" />,
      enabled: true,
      category: 'tasks',
      color: '#8B5CF6',
    },
    {
      id: 'monthly-tasks',
      title: 'المهام الشهرية',
      description: 'تذكير بالمهام الشهرية',
      icon: <Calendar size={20} color="#EC4899" />,
      enabled: true,
      category: 'tasks',
      color: '#EC4899',
    },
    
    // إشعارات العادات
    {
      id: 'daily-habits',
      title: 'العادات اليومية',
      description: 'تذكير بالعادات اليومية',
      icon: <TrendingUp size={20} color="#10B981" />,
      enabled: true,
      category: 'habits',
      color: '#10B981',
    },
    
    // إشعارات الأهداف الكبيرة
    {
      id: 'big-goals-saving',
      title: 'ادخار الأهداف الكبيرة',
      description: 'تذكير شهري بادخار المبلغ المحدد',
      icon: <Target size={20} color="#F59E0B" />,
      enabled: true,
      category: 'goals',
      color: '#F59E0B',
    },
    
    // إشعارات الملاحظات الذكية
    {
      id: 'smart-notes',
      title: 'الملاحظات الذكية',
      description: 'تذكير بالملاحظات حسب الإعدادات',
      icon: <Brain size={20} color="#EC4899" />,
      enabled: true,
      category: 'notes',
      color: '#EC4899',
    },
  ]);

  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [notificationService] = useState(() => NotificationService.getInstance());

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  useEffect(() => {
    initializeNotifications();
    loadScheduledNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // طلب الأذونات
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }

      // إعداد معالج الإشعارات
      NotificationService.setupNotificationHandler();
    } catch (error) {
      console.error('خطأ في تهيئة الإشعارات:', error);
      setPermissionStatus('error');
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await notificationService.getScheduledNotifications();
      const formattedNotifications: ScheduledNotification[] = scheduled.map(notification => ({
        id: notification.identifier,
        title: notification.content.title || '',
        body: notification.content.body || '',
        nextTriggerDate: notification.trigger && typeof notification.trigger === 'object' && 'date' in notification.trigger 
          ? new Date(notification.trigger.date as any) 
          : null,
        category: notification.content.data?.type || 'general',
        enabled: true,
      }));
      
      setScheduledNotifications(formattedNotifications);
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات المجدولة:', error);
    }
  };

  const toggleNotificationSetting = async (settingId: string) => {
    const updatedSettings = notificationSettings.map(setting => {
      if (setting.id === settingId) {
        return { ...setting, enabled: !setting.enabled };
      }
      return setting;
    });
    
    setNotificationSettings(updatedSettings);

    // هنا يمكن إضافة منطق تفعيل/إلغاء الإشعارات الفعلية
    const setting = updatedSettings.find(s => s.id === settingId);
    if (setting) {
      if (setting.enabled) {
        // تفعيل الإشعار
        await scheduleNotificationBySetting(setting);
      } else {
        // إلغاء الإشعار
        await cancelNotificationBySetting(setting);
      }
    }
  };

  const scheduleNotificationBySetting = async (setting: NotificationSetting) => {
    try {
      switch (setting.id) {
        case 'monthly-income':
          await notificationService.scheduleMonthlyIncomeReminder();
          break;
        // يمكن إضافة المزيد من الحالات هنا
      }
      Alert.alert('تم التفعيل', `تم تفعيل ${setting.title} بنجاح`);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تفعيل الإشعار');
    }
  };

  const cancelNotificationBySetting = async (setting: NotificationSetting) => {
    try {
      // إلغاء الإشعارات المرتبطة بهذا الإعداد
      const scheduled = await notificationService.getScheduledNotifications();
      const relatedNotifications = scheduled.filter(n => 
        n.content.data?.type === setting.id.replace('-', '_')
      );
      
      for (const notification of relatedNotifications) {
        await notificationService.cancelNotification(notification.identifier);
      }
      
      Alert.alert('تم الإلغاء', `تم إلغاء ${setting.title} بنجاح`);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إلغاء الإشعار');
    }
  };

  const requestPermissions = async () => {
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setPermissionStatus('granted');
        Alert.alert('تم بنجاح', 'تم منح أذونات الإشعارات');
      } else {
        setPermissionStatus('denied');
        Alert.alert('فشل', 'لم يتم منح أذونات الإشعارات');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ في طلب الأذونات');
    }
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'مسح جميع الإشعارات',
      'هل أنت متأكد من مسح جميع الإشعارات المجدولة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'مسح', 
          style: 'destructive', 
          onPress: async () => {
            await notificationService.cancelAllNotifications();
            setScheduledNotifications([]);
            Alert.alert('تم المسح', 'تم مسح جميع الإشعارات المجدولة');
          }
        },
      ]
    );
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return '#10B981';
      case 'denied': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted': return 'مفعلة';
      case 'denied': return 'مرفوضة';
      case 'error': return 'خطأ';
      default: return 'غير معروفة';
    }
  };

  const categories = [
    { id: 'finance', name: 'المالية', emoji: '💰', color: '#10B981' },
    { id: 'tasks', name: 'المهام', emoji: '✅', color: '#3B82F6' },
    { id: 'habits', name: 'العادات', emoji: '📈', color: '#8B5CF6' },
    { id: 'goals', name: 'الأهداف', emoji: '🎯', color: '#F59E0B' },
    { id: 'notes', name: 'الملاحظات', emoji: '🧠', color: '#EC4899' },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Bell size={24} color="#095028" />
            <Text style={styles.title}>إدارة الإشعارات</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* حالة الأذونات */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>حالة أذونات الإشعارات</Text>
              <Text style={[
                styles.permissionStatus,
                { color: getPermissionStatusColor() }
              ]}>
                {getPermissionStatusText()}
              </Text>
            </View>
            <View style={[
              styles.permissionIndicator,
              { backgroundColor: getPermissionStatusColor() }
            ]} />
          </View>
          
          {permissionStatus !== 'granted' && (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Settings size={16} color="#FFFFFF" />
              <Text style={styles.permissionButtonText}>طلب الأذونات</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* إحصائيات سريعة */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {notificationSettings.filter(s => s.enabled).length}
            </Text>
            <Text style={styles.statLabel}>مفعلة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{scheduledNotifications.length}</Text>
            <Text style={styles.statLabel}>مجدولة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>فئات</Text>
          </View>
        </View>

        {/* إعدادات الإشعارات حسب الفئة */}
        {categories.map((category) => {
          const categorySettings = notificationSettings.filter(s => s.category === category.id);
          if (categorySettings.length === 0) return null;

          return (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[styles.categoryTitle, { color: category.color }]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  ({categorySettings.filter(s => s.enabled).length}/{categorySettings.length})
                </Text>
              </View>

              <View style={styles.settingsContainer}>
                {categorySettings.map((setting) => (
                  <View key={setting.id} style={styles.settingCard}>
                    <View style={styles.settingLeft}>
                      <View style={[
                        styles.settingIcon,
                        { backgroundColor: setting.color + '20' }
                      ]}>
                        {setting.icon}
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>{setting.title}</Text>
                        <Text style={styles.settingDescription}>
                          {setting.description}
                        </Text>
                      </View>
                    </View>
                    
                    <Switch
                      value={setting.enabled}
                      onValueChange={() => toggleNotificationSetting(setting.id)}
                      trackColor={{ false: '#E5E7EB', true: '#A2E9C1' }}
                      thumbColor={setting.enabled ? '#095028' : '#9CA3AF'}
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* الإشعارات المجدولة */}
        <View style={styles.scheduledSection}>
          <View style={styles.scheduledHeader}>
            <Text style={styles.scheduledTitle}>الإشعارات المجدولة</Text>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearAllNotifications}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text style={styles.clearButtonText}>مسح الكل</Text>
            </TouchableOpacity>
          </View>

          {scheduledNotifications.length === 0 ? (
            <View style={styles.emptyScheduled}>
              <Bell size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>لا توجد إشعارات مجدولة</Text>
              <Text style={styles.emptySubtitle}>
                قم بتفعيل الإشعارات أعلاه لتظهر هنا
              </Text>
            </View>
          ) : (
            <View style={styles.scheduledList}>
              {scheduledNotifications.map((notification) => (
                <View key={notification.id} style={styles.scheduledCard}>
                  <View style={styles.scheduledInfo}>
                    <Text style={styles.scheduledTitle}>{notification.title}</Text>
                    <Text style={styles.scheduledBody}>{notification.body}</Text>
                    {notification.nextTriggerDate && (
                      <Text style={styles.scheduledDate}>
                        التالي: {notification.nextTriggerDate.toLocaleDateString('ar-SA')} 
                        {' '}
                        {notification.nextTriggerDate.toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={async () => {
                      await notificationService.cancelNotification(notification.id);
                      setScheduledNotifications(prev => 
                        prev.filter(n => n.id !== notification.id)
                      );
                    }}
                  >
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* نصائح الاستخدام */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 نصائح مهمة</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>
              • تأكد من تفعيل الإشعارات في إعدادات الجهاز
            </Text>
            <Text style={styles.tipItem}>
              • الإشعارات تعمل حتى عندما يكون التطبيق مغلقاً
            </Text>
            <Text style={styles.tipItem}>
              • يمكنك تخصيص أوقات الإشعارات من كل قسم
            </Text>
            <Text style={styles.tipItem}>
              • الإشعارات الذكية تتكيف مع سلوكك في التطبيق
            </Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'right',
  },
  permissionStatus: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  permissionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-end',
  },
  permissionButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
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
    color: '#095028',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    flex: 1,
    textAlign: 'right',
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  settingsContainer: {
    gap: 8,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'right',
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  scheduledSection: {
    marginBottom: 24,
  },
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduledTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#EF4444',
  },
  emptyScheduled: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  scheduledList: {
    gap: 8,
  },
  scheduledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scheduledInfo: {
    flex: 1,
  },
  scheduledBody: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'right',
  },
  scheduledDate: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  cancelButton: {
    padding: 8,
  },
  tipsSection: {
    backgroundColor: '#A2E9C1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
    marginBottom: 12,
    textAlign: 'right',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
    textAlign: 'right',
    lineHeight: 20,
  },
});