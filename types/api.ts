// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  idToken: string;
  fcmToken: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
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
