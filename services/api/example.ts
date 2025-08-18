import { API, TaskType, GoalType, NoteCategory, ExpenseCategory } from './index';

/**
 * Example usage of the GROWUPE API integration layer
 * This file demonstrates how to use all the API modules
 */

export class ApiExamples {
  /**
   * Authentication examples
   */
  static async authExamples() {
    console.log('=== Authentication Examples ===');

    // Login with Google
    const loginResult = await API.auth.loginWithGoogle('google-id-token', 'fcm-token');
    if (loginResult.success) {
      console.log('✅ Login successful:', loginResult.data);
    } else {
      console.log('❌ Login failed:', loginResult.error);
    }

    // Check if user is authenticated
    const isAuth = await API.auth.isAuthenticated();
    console.log('User authenticated:', isAuth);

    // Get user data
    const userData = await API.auth.getUserData();
    console.log('User data:', userData);
  }

  /**
   * Task management examples
   */
  static async taskExamples() {
    console.log('=== Task Examples ===');

    // Create a new task
    const newTask = {
      title: 'Complete React Native project',
      description: 'Finish the GROWUPE app development',
      type: TaskType.DAILY,
      priority: 'important' as const,
      category: 'daily' as const,
      dueDate: '2024-01-15',
      estimatedDuration: 180,
      notes: 'Focus on the main features and testing'
    };

    const createResult = await API.tasks.createTask(newTask);
    if (createResult.success && createResult.data) {
      console.log('✅ Task created:', createResult.data);

      // Update the task
      const updateResult = await API.tasks.updateTask(createResult.data.id, {
        notes: 'Halfway through the development'
      });
      console.log('✅ Task updated:', updateResult.data);

      // Toggle task completion
      const toggleResult = await API.tasks.toggleTask(createResult.data.id);
      console.log('✅ Task toggled:', toggleResult.data);
    }

    // Get tasks by type
    const dailyTasks = await API.tasks.getTasks(TaskType.DAILY);
    console.log('Daily tasks:', dailyTasks.data);

    // Get all tasks
    const allTasks = await API.tasks.getAllTasks();
    console.log('All tasks:', allTasks.data);
  }

  /**
   * Goal management examples
   */
  static async goalExamples() {
    console.log('=== Goal Examples ===');

    // Create a new goal
    const newGoal = {
      title: 'Save for vacation',
      description: 'Save money for summer vacation to Europe',
      targetAmount: 5000,
      currentAmount: 1000,
      type: GoalType.SAVINGS,
      targetDate: '2024-06-01',
      icon: '🏖️',
      color: '#4CAF50'
    };

    const createResult = await API.goals.addGoal(newGoal);
    if (createResult.success && createResult.data) {
      console.log('✅ Goal created:', createResult.data);

      // Add progress to the goal
      const progressResult = await API.goals.addNewAmount(createResult.data.id, 500);
      console.log('✅ Progress added:', progressResult.data);

      // Get goal progress
      const progress = await API.goals.getGoalProgress(createResult.data.id);
      console.log('Goal progress:', progress.data);
    }

    // Get all goals
    const allGoals = await API.goals.getGoals();
    console.log('All goals:', allGoals.data);

    // Get goals by type
    const savingsGoals = await API.goals.getGoalsByType(GoalType.SAVINGS);
    console.log('Savings goals:', savingsGoals.data);
  }

  /**
   * Finance management examples
   */
  static async financeExamples() {
    console.log('=== Finance Examples ===');

    // Set income for the month
    const incomeResult = await API.finance.setIncome('2024-01', 6000);
    console.log('✅ Income set:', incomeResult.data);

    // Get income
    const income = await API.finance.getIncome('2024-01');
    console.log('Current income:', income.data);

    // Add an expense
    const expense = {
      title: 'Groceries',
      amount: 200,
      category: ExpenseCategory.FOOD,
      date: '2024-01-10',
      description: 'Weekly groceries from supermarket',
      isRecurring: true,
      recurringType: 'weekly' as any
    };

    const expenseResult = await API.finance.addExpense(expense);
    if (expenseResult.success) {
      console.log('✅ Expense added:', expenseResult.data);
    }

    // Add an obligation
    const obligation = {
      title: 'Car loan payment',
      amount: 400,
      type: 'loan' as any,
      dueDate: '2024-01-15',
      description: 'Monthly car loan payment',
      isPaid: false,
      priority: 'high' as const
    };

    const obligationResult = await API.finance.addObligation(obligation);
    if (obligationResult.success) {
      console.log('✅ Obligation added:', obligationResult.data);
    }

    // Get finance overview
    const overview = await API.finance.getFinanceOverview('2024-01');
    console.log('Finance overview:', overview.data);

    // Get six months summary
    const summary = await API.finance.getSummarySixMonths();
    console.log('Six months summary:', summary.data);
  }

  /**
   * Smart notes examples
   */
  static async notesExamples() {
    console.log('=== Smart Notes Examples ===');

    // Create a new note
    const newNote = {
      title: 'Meeting Notes',
      content: 'Discuss project timeline and milestones for Q1 2024',
      category: NoteCategory.WORK,
      isPinned: true,
      tags: ['meeting', 'project', 'timeline'],
      isTask: false,
      color: '#2196F3',
      fontSize: 16,
      textAlignment: 'left' as const
    };

    const createResult = await API.notes.createNote(newNote);
    if (createResult.success && createResult.data) {
      console.log('✅ Note created:', createResult.data);

      // Toggle pin status
      const pinResult = await API.notes.togglePinNote(createResult.data.id);
      console.log('✅ Pin toggled:', pinResult.data);
    }

    // Get all notes
    const allNotes = await API.notes.getAllNotes();
    console.log('All notes:', allNotes.data);

    // Get notes by category
    const workNotes = await API.notes.getNotesByCategory(NoteCategory.WORK);
    console.log('Work notes:', workNotes.data);

    // Get pinned notes
    const pinnedNotes = await API.notes.getPinnedNotes();
    console.log('Pinned notes:', pinnedNotes.data);

    // Search notes
    const searchResult = await API.notes.searchNotes('meeting');
    console.log('Search results:', searchResult.data);
  }

  /**
   * Notifications examples
   */
  static async notificationExamples() {
    console.log('=== Notification Examples ===');

    // Get all notifications
    const notifications = await API.notifications.getNotifications();
    console.log('All notifications:', notifications.data);

    // Get unread count
    const unreadCount = await API.notifications.getUnreadCount();
    console.log('Unread notifications:', unreadCount.data);

    // Get notification settings
    const settings = await API.notifications.getNotiSettings();
    console.log('Notification settings:', settings.data);

    if (settings.success && settings.data && settings.data.length > 0) {
      // Update a notification setting
      const updateResult = await API.notifications.updateNotiSetting(
        settings.data[0].id,
        false
      );
      console.log('✅ Setting updated:', updateResult.data);
    }

    // Mark all as read
    const markAllResult = await API.notifications.markAllAsRead();
    console.log('✅ All marked as read:', markAllResult.success);
  }

  /**
   * Run all examples
   */
  static async runAllExamples() {
    try {
      await this.authExamples();
      await this.taskExamples();
      await this.goalExamples();
      await this.financeExamples();
      await this.notesExamples();
      await this.notificationExamples();
      
      console.log('🎉 All examples completed successfully!');
    } catch (error) {
      console.error('❌ Error running examples:', error);
    }
  }

  /**
   * Cleanup example - logout
   */
  static async cleanup() {
    console.log('=== Cleanup ===');
    
    const logoutResult = await API.auth.logout();
    if (logoutResult.success) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed:', logoutResult.error);
    }
  }
}

// Export for use in other files
export default ApiExamples;
