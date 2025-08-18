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
  trigger: any;
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
      title: '💰💼 وصلت بداية الشهر؟ معاناه وقت الإدخال!',
      body: 'لا تنسَ تسجيل راتبك الشهري في Growupe عشان نضبط لك ميزانيتك ✨ من أول يوم! 😉 خلنا نخطط مع بعض قبل لا تصرف ريال واحد!',
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
    
    // تحسين منطق التحذير - تحذير عند تجاوز 50% من الراتب
    if (percentage >= 50) {
      // إلغاء أي تحذيرات سابقة
      await this.cancelNotification('expense-warning');
      
      return this.scheduleNotification({
        id: 'expense-warning',
        title: '💸 "هونها تهون!"',
        body: `"مصاريفك تعدّت نص راتبك!" 😉 "خذ لك لحظة، وراجع يون حار ريال، قبل لا يطيح الفأس بالراس!" (${percentage.toFixed(0)}% من راتبك)`,
        data: { type: 'expense_warning', screen: 'finance', percentage: percentage },
        trigger: { seconds: 1, repeats: false }, // إشعار فوري
      });
    }
    return '';
  }

  // تحذير الالتزامات - عند تجاوز 50% من الراتب
  async scheduleCommitmentWarning(totalCommitments: number, monthlyIncome: number): Promise<string> {
    const percentage = (totalCommitments / monthlyIncome) * 100;
    
    // تحذير عند تجاوز 50% من الراتب بالالتزامات فقط
    if (percentage >= 50) {
      // إلغاء أي تحذيرات سابقة للالتزامات
      await this.cancelNotification('commitment-warning');
      
      return this.scheduleNotification({
        id: 'commitment-warning',
        title: '📉 يا حرّيص،التزاماتك كثرت شوي!',
        body: `💼 نص راتبك طار قبل الشهر ما يكمُل، خلينا نراجع نرتّبها سوا. (${percentage.toFixed(0)}% من راتبك)`,
        data: { type: 'commitment_warning', screen: 'finance', percentage: percentage },
        trigger: { seconds: 1, repeats: false }, // إشعار فوري
      });
    }
    return '';
  }

  // تقرير نهاية الشهر - تقييم الأداء المالي
  async scheduleEndOfMonthReport(totalExpenses: number, totalCommitments: number, monthlyIncome: number): Promise<string> {
    const totalSpent = totalExpenses + totalCommitments;
    const percentage = (totalSpent / monthlyIncome) * 100;
    
    // إلغاء أي تقارير سابقة
    await this.cancelNotification('end-of-month-report');
    
    // تقرير الأداء السيء - عند تجاوز 80% من الراتب
    if (percentage >= 80) {
      return this.scheduleNotification({
        id: 'end-of-month-report',
        title: 'مصاريف مرتفعة:',
        body: `"صار وقت كشف الحساب الحقيقي! 📊 مصاريفك هذا الشهر كانت كثيرة، بس لا تشيل هم، نعيد ترتيب أوراقك ونبدأ من جديد بقوة! 💪" (${percentage.toFixed(0)}% من راتبك)`,
        data: { type: 'end_of_month_report', screen: 'finance', percentage: percentage, performance: 'poor' },
        trigger: { seconds: 1, repeats: false },
      });
    }
    
    // تقرير الأداء الممتاز - عند توفير أكثر من 30% من الراتب
    if (percentage <= 70) {
      return this.scheduleNotification({
        id: 'end-of-month-report',
        title: 'أداء ممتاز:',
        body: `"يا سلام! 👏 أداءك المالي هذا الشهر ممتاز! وفّرت وقدرت تمسك نفسك، وهذي بداية مشوار الاستقلال المالي الحقيقي ✨" (${percentage.toFixed(0)}% من راتبك)`,
        data: { type: 'end_of_month_report', screen: 'finance', percentage: percentage, performance: 'excellent' },
        trigger: { seconds: 1, repeats: false },
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

  // إشعار تحفيز المهام اليومية - كل 24 ساعة
  async scheduleDailyTaskMotivation(): Promise<string> {
    // إلغاء أي إشعارات تحفيز سابقة
    await this.cancelNotification('daily-task-motivation');
    
    // جدولة الإشعار التحفيزي كل 24 ساعة (8:00 صباحاً)
    return this.scheduleNotification({
      id: 'daily-task-motivation',
      title: 'صباح الطموح يا صديق التغيير! 🌅',
      body: 'وش تنتظر؟ مهامك تنتظرك تحققها وحدة وحدة، خلنا ننجز اليوم مع بعض ✅',
      data: { type: 'daily_task_motivation', screen: 'daily-goals' },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  }

  // إشعار تحفيز المهام الأسبوعية - كل جمعة
  async scheduleWeeklyTaskMotivation(): Promise<string> {
    // إلغاء أي إشعارات تحفيز أسبوعية سابقة
    await this.cancelNotification('weekly-task-motivation');
    
    // جدولة الإشعار التحفيزي كل جمعة (9:00 صباحاً)
    return this.scheduleNotification({
      id: 'weekly-task-motivation',
      title: 'جمعة مباركة! ✨',
      body: 'وش أنجزت هذا الأسبوع؟ راجع مهامك، وسو تقييم سريع لأدائك. النجاح عادة، وأنت قدّها!',
      data: { type: 'weekly_task_motivation', screen: 'daily-goals' },
      trigger: {
        weekday: 5, // الجمعة (0 = الأحد، 5 = الجمعة)
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }

  // إشعار تحفيز المهام الشهرية - أول يوم من كل شهر
  async scheduleMonthlyTaskMotivation(): Promise<string> {
    // إلغاء أي إشعارات تحفيز شهرية سابقة
    await this.cancelNotification('monthly-task-motivation');
    
    // جدولة الإشعار التحفيزي أول يوم من كل شهر (10:00 صباحاً)
    return this.scheduleNotification({
      id: 'monthly-task-motivation',
      title: 'شهر جديد، أهداف جديدة 🎯',
      body: 'نظّم مهامك من الحين وابدأ بداية تليق فيك… Growupe معك خطوة بخطوة 🚀',
      data: { type: 'monthly_task_motivation', screen: 'daily-goals' },
      trigger: {
        day: 1, // أول يوم من الشهر
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  }

  // 📝 إشعارات الملاحظات
  async scheduleNoteReminder(noteTitle: string, noteId: string): Promise<string> {
    return this.scheduleNotification({
      id: `note-reminder-${noteId}`,
      title: 'تذكير بسيط بمذكّرتك: 📝',
      body: `'${noteTitle}' تبينا نساعدك تحوّلها لفعل؟ نقدر نربطها بمهمة أو هدف 😉`,
      data: { type: 'note_reminder', noteId: noteId, screen: 'smart-notes' },
      trigger: {
        seconds: 10800, // 3 ساعات
        repeats: false,
      },
    });
  }

  // 🎯 إشعارات الأهداف الكبرى
  async scheduleBigGoalsWeeklyReview(): Promise<string> {
    await this.cancelNotification('big-goals-weekly-review');
    
    return this.scheduleNotification({
      id: 'big-goals-weekly-review',
      title: 'أحد الطموح! 🚀',
      body: 'وين وصلت في أهدافك الكبيرة؟ خلّنا نراجع مع بعض، ولو تحتاج نغيرّ الخطة، Growupe جاهز معك ✨',
      data: { type: 'big_goals_weekly_review', screen: 'big-goals' },
      trigger: {
        weekday: 0, // الأحد
        hour: 11,
        minute: 0,
        repeats: true,
      },
    });
  }

  async scheduleBigGoalInactivityReminder(goalName: string, goalId: string): Promise<string> {
    return this.scheduleNotification({
      id: `big-goal-inactivity-${goalId}`,
      title: 'ما نسينا حلمك الكبير! 💡',
      body: `صار لك فترة ما حدّثت هدفك '${goalName}' يلا نرجع نكمل، التراجع ما هو خيار 🔥`,
      data: { type: 'big_goal_inactivity', goalId: goalId, screen: 'big-goals' },
      trigger: {
        seconds: 604800, // أسبوع واحد
        repeats: false,
      },
    });
  }

  async scheduleBigGoalMilestone(goalName: string, goalId: string, percentage: number): Promise<string> {
    return this.scheduleNotification({
      id: `big-goal-milestone-${goalId}-${percentage}`,
      title: 'يا نجم! ⭐',
      body: `أنجزت ${percentage}% من هدفك الكبير '${goalName}' خلك مستمر، النجاح قدّامك ينتظرك! 🌟`,
      data: { type: 'big_goal_milestone', goalId: goalId, percentage: percentage, screen: 'big-goals' },
      trigger: {
        seconds: 1,
        repeats: false,
      },
    });
  }

  // 💚 الإشعارات التحفيزية العامة
  async scheduleGeneralMotivation(): Promise<string> {
    const motivations = [
      {
        title: 'تطوّرك ما يحتاج معجزة… بس يحتاج تبدأ!',
        body: 'ابدأ اليوم، حتى لو بخطوة صغيرة 😉'
      },
      {
        title: 'تذكّر… المال والعادة والهدف، ثلاثي النجاح.',
        body: 'Growupe 💚 وجميعهم تحت جناح واحد.'
      },
      {
        title: 'لو نفسك تغيرّ شي في حياتك، لا تنتظر أحد.',
        body: 'ابدأ بنفسك… وخل Growupe رفيقك في الرحلة! 🚀'
      }
    ];

    // اختيار تحفيز عشوائي
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    
    await this.cancelNotification('general-motivation');
    
    return this.scheduleNotification({
      id: 'general-motivation',
      title: randomMotivation.title,
      body: randomMotivation.body,
      data: { type: 'general_motivation', screen: 'index' },
      trigger: {
        hour: 12,
        minute: 0,
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

    let trigger: any;
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

  // جدولة إشعار ترحيبي كل 30 ثانية
  async scheduleWelcomeNotification(): Promise<string> {
    // إلغاء أي إشعارات ترحيبية سابقة
    await this.cancelNotification('welcome-notification');
    
    // جدولة الإشعار الأول بعد 30 ثانية
    const firstNotificationId = await this.scheduleNotification({
      id: 'welcome-notification',
      title: 'hello',
      body: 'welcome to growUp',
      data: { type: 'welcome' },
      trigger: {
        seconds: 30,
        repeats: false,
      },
    });

    // جدولة الإشعارات المتكررة كل 30 ثانية
    const scheduleNextNotification = async () => {
      try {
        await this.scheduleNotification({
          id: `welcome-notification-${Date.now()}`,
          title: 'hello',
          body: 'welcome to growUp',
          data: { type: 'welcome' },
          trigger: {
            seconds: 30,
            repeats: false,
          },
        });
      } catch (error) {
        console.error('خطأ في جدولة الإشعار التالي:', error);
      }
    };

    // جدولة الإشعار التالي بعد 30 ثانية
    setTimeout(scheduleNextNotification, 30000);

    return firstNotificationId;
  }

  // بدء الإشعارات المتكررة كل 30 ثانية
  startRecurringWelcomeNotifications(): void {
    const scheduleNotification = async () => {
      try {
        await this.scheduleNotification({
          id: `welcome-notification-${Date.now()}`,
          title: 'hello',
          body: 'welcome to growUp',
          data: { type: 'welcome' },
          trigger: {
            seconds: 1, // إشعار فوري
            repeats: false,
          },
        });
      } catch (error) {
        console.error('خطأ في جدولة الإشعار:', error);
      }
    };

    // جدولة الإشعار الأول
 

    // جدولة الإشعارات كل 30 ثانية
    // setInterval(scheduleNotification, 30000);
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