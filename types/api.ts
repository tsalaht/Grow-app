// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
// Request types
export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string; // Optional as per API docs
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  fcmToken?: string; // Optional
}

// Additional request types for other endpoints
export interface ActivateRequest {
  activationToken: string;
  activationCode: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  resetCode: string;
  newPassword: string;
}



export interface RegisterResponse {
  success: boolean;
  message: string;
  activationToken: string;
}

export interface ActivateResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    notificationSettings?: any[]; // Array of settings, define further if needed
  };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    fcmToken?: string;
    lastLoginAt: string; // ISO date string
  };
}

export interface LogoutResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface GetUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    fcmToken?: string;
    lastLoginAt?: string;
  };
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

// User model (from schema, for reference if needed in app state)
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Never expose this
  image?: string;
  createdAt: string;
  updatedAt: string;
  fcmToken?: string;
  firebaseUid?: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  // Relations like tasks, incomes, etc., can be added if integrating other modules
}
// Finance Types
export interface IncomeRequest {
  month: string; // Format: "YYYY-MM"
  amount: number;
}

export interface IncomeResponse {
  month: string;
  amount: number;
}

export interface FinanceOverview {
  totalIncome: number;
  totalExpenses: number;
  totalObligations: number;
  remainingAmount: number;
  expenses: Expense[];
  obligations: Obligation[];
}

export interface SummarySixMonths {
  months: string[];
  incomes: number[];
  expenses: number[];
  obligations: number[];
  remaining: number[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description?: string;
  isRecurring: boolean;
  recurringType?: RecurringType;
}

export interface Obligation {
  id: string;
  title: string;
  amount: number;
  type: ObligationType;
  dueDate: string;
  description?: string;
  isPaid: boolean;
  priority: 'high' | 'medium' | 'low';
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  BILLS = 'bills',
  HEALTH = 'health',
  EDUCATION = 'education',
  OTHER = 'other'
}

export enum ObligationType {
  LOAN = 'loan',
  CREDIT_CARD = 'credit_card',
  MORTGAGE = 'mortgage',
  INSURANCE = 'insurance',
  SUBSCRIPTION = 'subscription',
  OTHER = 'other'
}

export enum RecurringType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// Task Types
export interface TaskRequest {
  title: string;
  description?: string;
  type: TaskType;
  priority: 'urgent' | 'important' | 'normal' | 'low';
  dueDate?: string;
  estimatedDuration?: number;
  category: 'daily' | 'weekly' | 'monthly';
  notes?: string;
  icon?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: 'completed' | 'in-progress' | 'overdue' | 'paused';
  priority: 'urgent' | 'important' | 'normal' | 'low';
  dueDate?: string;
  estimatedDuration?: number;
  progress: number;
  category: 'daily' | 'weekly' | 'monthly';
  notes?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

// Goal Types
export interface GoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  type: GoalType;
  targetDate?: string;
  icon?: string;
  color?: string;
}

export interface GoalResponse {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  type: GoalType;
  targetDate?: string;
  icon?: string;
  color?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export enum GoalType {
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  PURCHASE = 'purchase',
  TRAVEL = 'travel',
  EDUCATION = 'education',
  HEALTH = 'health',
  OTHER = 'other'
}

// Smart Notes Types
export interface NoteRequest {
  title: string;
  content: string;
  category: NoteCategory;
  isPinned?: boolean;
  reminder?: string;
  tags?: string[];
  isTask?: boolean;
  color?: string;
  fontSize?: number;
  textAlignment?: 'left' | 'center' | 'right';
  textFormats?: any;
}

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  reminder?: string;
  tags?: string[];
  isTask: boolean;
  color?: string;
  fontSize?: number;
  textAlignment?: 'left' | 'center' | 'right';
  textFormats?: any;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export enum NoteCategory {
  PERSONAL = 'personal',
  WORK = 'work',
  STUDY = 'study',
  SHOPPING = 'shopping',
  IDEAS = 'ideas',
  REMINDERS = 'reminders',
  OTHER = 'other'
}

// Notification Types
export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface NotificationSettings {
  id: string;
  type: NotificationType;
  enabled: boolean;
  title: string;
  description: string;
}

export enum NotificationCategory {
  TASK = 'task',
  GOAL = 'goal',
  EXPENSE = 'expense',
  OBLIGATION = 'obligation',
  NOTE = 'note',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}

export enum NotificationType {
  TASK_DUE = 'task_due',
  TASK_OVERDUE = 'task_overdue',
  GOAL_MILESTONE = 'goal_milestone',
  EXPENSE_REMINDER = 'expense_reminder',
  OBLIGATION_DUE = 'obligation_due',
  NOTE_REMINDER = 'note_reminder',
  SYSTEM_UPDATE = 'system_update'
}

export enum ReminderType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}
