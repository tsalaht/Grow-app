// Import all API modules
import { AuthApi } from './authApi';
import { FinanceApi } from './financeApi';
import { TasksApi } from './tasksApi';
import { GoalsApi } from './goalsApi';
import { NotesApi } from './notesApi';
import { NotificationsApi } from './notificationsApi';

// Export all API modules
export { AuthApi } from './authApi';
export { FinanceApi } from './financeApi';
export { TasksApi } from './tasksApi';
export { GoalsApi } from './goalsApi';
export { NotesApi } from './notesApi';
export { NotificationsApi } from './notificationsApi';

// Export axios instance
export { default as axiosInstance } from './axiosInstance';

// Export all types and enums
export {
  // API Response Types
  ApiResponse,
  
  // Auth Types
  LoginRequest,
  LoginResponse,
  
  // Finance Types
  IncomeRequest,
  IncomeResponse,
  FinanceOverview,
  SummarySixMonths,
  Expense,
  Obligation,
  ExpenseCategory,
  ObligationType,
  RecurringType,
  
  // Task Types
  TaskRequest,
  TaskResponse,
  TaskType,
  
  // Goal Types
  GoalRequest,
  GoalResponse,
  GoalType,
  
  // Smart Notes Types
  NoteRequest,
  NoteResponse,
  NoteCategory,
  
  // Notification Types
  NotificationResponse,
  NotificationSettings,
  NotificationCategory,
  NotificationType,
  ReminderType,
} from '../../types/api';

// Export a convenience object with all APIs
export const API = {
  auth: AuthApi,
  finance: FinanceApi,
  tasks: TasksApi,
  goals: GoalsApi,
  notes: NotesApi,
  notifications: NotificationsApi,
};
