import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// إعداد سلوك الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  trigger: Notifications.NotificationTriggerInput;
  categoryId?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // طلب الأذونات وتسجيل الجهاز
  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#095028',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('فشل في الحصول على إذن الإشعارات!');
        return null;
      }
      
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id-here',
      });
      
      this.expoPushToken = token.data;
      return token.data;
          } else {
        console.log('يجب استخدام جهاز حقيقي للإشعارات الفورية');
        return null;
      }
    } catch (error) {
      console.error('خطأ في تسجيل الإشعارات:', error);
      return null;
    }
  }

  // جدولة إشعار محلي
  async scheduleNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: notification.trigger,
      });
      
      return notificationId;
    } catch (error) {
      console.error('خطأ في جدولة الإشعار:', error);
      throw error;
    }
  }

  // إلغاء إشعار محدد
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // إلغاء جميع الإشعارات
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // الحصول على جميع الإشعارات المجدولة
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // إشعارات القسم المالي
  async scheduleMonthlyIncomeReminder(): Promise<string> {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);
    
    return this.scheduleNotification({
      id: 'monthly-income-reminder',
      title: '💰 تذكير الراتب الشهري',
      body: 'حان وقت إدخال راتبك الشهري لهذا الشهر',
      data: { type: 'monthly_income', screen: 'finance' },
      trigger: {
        date: nextMonth,
        repeats: true,
      },
    });
  }

  async scheduleCommitmentReminder(commitment: any, daysBefore: number = 1): Promise<string> {
    const reminderDate = new Date(commitment.dueDate);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);
    reminderDate.setHours(10, 0, 0, 0);

    return this.scheduleNotification({
      id: `commitment-${commitment.id}`,
      title: '📅 تذكير التزام مالي',
      body: `يستحق دفع ${commitment.name} بمبلغ ${commitment.amount} رس خلال ${daysBefore} يوم`,
      data: { type: 'commitment', commitmentId: commitment.id, screen: 'finance' },
      trigger: {
        date: reminderDate,
        repeats: commitment.recurring || false,
      },
    });
  }

  async scheduleExpenseWarning(currentExpenses: number, monthlyIncome: number): Promise<string> {
    const percentage = (currentExpenses / monthlyIncome) * 100;
    
    if (percentage >= 50) {
      return this.scheduleNotification({
        id: 'expense-warning',
        title: '⚠️ تحذير المصروفات',
        body: `لقد تجاوزت مصروفاتك ${percentage.toFixed(0)}% من راتبك الشهري. يُنصح بمراجعة مصروفاتك`,
        data: { type: 'expense_warning', screen: 'finance' },
        trigger: { seconds: 1, repeats: false }, // إشعار فوري
      });
    }
    return '';
  }

  // إشعارات المهام
  async scheduleDailyTaskReminder(task: any): Promise<string> {
    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    
    return this.scheduleNotification({
      id: `daily-task-${task.id}`,
      title: '⏰ تذكير مهمة يومية',
      body: `حان وقت تنفيذ: ${task.title}`,
      data: { type: 'daily_task', taskId: task.id, screen: 'daily-goals' },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }

  async scheduleWeeklyTaskReminder(task: any): Promise<string> {
    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    
    return this.scheduleNotification({
      id: `weekly-task-${task.id}`,
      title: '📅 تذكير مهمة أسبوعية',
      body: `حان وقت تنفيذ: ${task.title}`,
      data: { type: 'weekly_task', taskId: task.id, screen: 'daily-goals' },
      trigger: {
        weekday: task.weekday,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }

  async scheduleMonthlyTaskReminder(task: any): Promise<string> {
    const [hours, minutes] = task.reminderTime.split(':').map(Number);
    
    return this.scheduleNotification({
      id: `monthly-task-${task.id}`,
      title: '🗓 تذكير مهمة شهرية',
      body: `حان وقت تنفيذ: ${task.title}`,
      data: { type: 'monthly_task', taskId: task.id, screen: 'daily-goals' },
      trigger: {
        day: task.dayOfMonth,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }

  // إشعارات العادات
  async scheduleHabitReminder(habit: any): Promise<string> {
    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    
    return this.scheduleNotification({
      id: `habit-${habit.id}`,
      title: '📈 تذكير عادة يومية',
      body: `حان وقت ممارسة: ${habit.title}`,
      data: { type: 'habit', habitId: habit.id, screen: 'daily-habits' },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }

  // إشعارات الأهداف الكبيرة
  async scheduleBigGoalSavingReminder(goal: any): Promise<string> {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5, 18, 0, 0);
    
    return this.scheduleNotification({
      id: `big-goal-${goal.id}`,
      title: '🏆 تذكير الهدف الكبير',
      body: `حان وقت ادخار ${goal.monthlyAmount} رس لتحقيق هدف: ${goal.name}. أنت أقرب للنجاح! 💪`,
      data: { type: 'big_goal', goalId: goal.id, screen: 'big-goals' },
      trigger: {
        date: nextMonth,
        repeats: true,
      },
    });
  }

  // إشعارات الملاحظات الذكية
  async scheduleSmartNoteReminder(note: any): Promise<string> {
    if (!note.reminderSettings || !note.reminderSettings.enabled) return '';

    let trigger: Notifications.NotificationTriggerInput;
    const now = new Date();

    switch (note.reminderSettings.type) {
      case 'hourly':
        trigger = { seconds: 3600, repeats: true };
        break;
      case 'every-2-hours':
        trigger = { seconds: 7200, repeats: true };
        break;
      case 'after-time':
        trigger = { seconds: 3600, repeats: false }; // بعد ساعة
        break;
      case 'specific-time':
        const [hours, minutes] = (note.reminderSettings.time || '17:00').split(':').map(Number);
        trigger = { hour: hours, minute: minutes, repeats: true };
        break;
      case 'tomorrow':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [tomorrowHours, tomorrowMinutes] = (note.reminderSettings.time || '17:00').split(':').map(Number);
        tomorrow.setHours(tomorrowHours, tomorrowMinutes, 0, 0);
        trigger = { date: tomorrow, repeats: false };
        break;
      default:
        trigger = { seconds: 3600, repeats: false };
    }

    return this.scheduleNotification({
      id: `smart-note-${note.id}`,
      title: '🧠 تذكير ملاحظة ذكية',
      body: `تذكير: ${note.title || note.content.substring(0, 50)}...`,
      data: { type: 'smart_note', noteId: note.id, screen: 'smart-notes' },
      trigger: trigger || { seconds: 3600, repeats: false },
    });
  }

  // معالج النقر على الإشعار
  static setupNotificationHandler() {
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      // هنا يمكن إضافة منطق التنقل حسب نوع الإشعار
      if (data.screen) {
        // التنقل إلى الشاشة المحددة
        console.log('Navigate to:', data.screen, 'with data:', data);
      }
    });
  }
}

export default NotificationService;