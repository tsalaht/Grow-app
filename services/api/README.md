# API Integration Layer

This directory contains a complete API integration layer for the GROWUPE backend at `https://api.growupe.com/api`.

## Features

- **Axios-based HTTP client** with automatic token management
- **TypeScript interfaces** for all requests and responses
- **Automatic 401 handling** with logout and redirect
- **Modular organization** by feature (Auth, Finance, Tasks, etc.)
- **Comprehensive error handling** with consistent error responses
- **AsyncStorage integration** for token persistence

## Structure

```
services/api/
├── axiosInstance.ts      # Configured axios instance with interceptors
├── authApi.ts           # Authentication API
├── financeApi.ts        # Finance management API
├── tasksApi.ts          # Tasks management API
├── goalsApi.ts          # Goals management API
├── notesApi.ts          # Smart notes API
├── notificationsApi.ts  # Notifications API
├── index.ts             # Main export file
└── README.md           # This documentation
```

## Quick Start

```typescript
import { API, AuthApi, FinanceApi } from '../services/api';

// Using individual APIs
const loginResult = await AuthApi.loginWithGoogle(idToken, fcmToken);
const income = await FinanceApi.getIncome('2024-01');

// Using convenience API object
const tasks = await API.tasks.getTasks('daily');
const goals = await API.goals.getGoals();
```

## Authentication

The API automatically handles authentication tokens:

- **Token Storage**: Tokens are stored in AsyncStorage
- **Automatic Headers**: Authorization headers are added to all requests
- **401 Handling**: Automatic logout and redirect on authentication failures

```typescript
// Login
const result = await AuthApi.loginWithGoogle(idToken, fcmToken);
if (result.success) {
  // Token is automatically stored
  console.log('Logged in successfully');
}

// Check authentication status
const isAuthenticated = await AuthApi.isAuthenticated();

// Logout
await AuthApi.logout(); // Clears token and redirects to login
```

## API Modules

### Auth API (`AuthApi`)

```typescript
// Login with Google
AuthApi.loginWithGoogle(idToken: string, fcmToken: string)

// Logout
AuthApi.logout()

// Check authentication
AuthApi.isAuthenticated()

// Get user data
AuthApi.getUserData()
```

### Finance API (`FinanceApi`)

```typescript
// Income management
FinanceApi.setIncome(month: string, amount: number)
FinanceApi.getIncome(month: string)
FinanceApi.getFinanceOverview(month: string)
FinanceApi.getSummarySixMonths()

// Expenses
FinanceApi.addExpense(expense: Omit<Expense, 'id'>)
FinanceApi.getAllExpenses()
FinanceApi.getCurrentMonthExpenses()
FinanceApi.updateExpense(id: string, data: Partial<Expense>)
FinanceApi.deleteExpense(id: string)

// Obligations
FinanceApi.addObligation(obligation: Omit<Obligation, 'id'>)
FinanceApi.getObligations()
FinanceApi.updateObligation(id: string, data: Partial<Obligation>)
FinanceApi.deleteObligation(id: string)
```

### Tasks API (`TasksApi`)

```typescript
// CRUD operations
TasksApi.createTask(data: TaskRequest)
TasksApi.getTasks(type: TaskType)
TasksApi.updateTask(id: string, data: Partial<TaskRequest>)
TasksApi.toggleTask(id: string)
TasksApi.deleteTask(id: string)

// Additional methods
TasksApi.getAllTasks()
TasksApi.getTasksByCategory(category: 'daily' | 'weekly' | 'monthly')
```

### Goals API (`GoalsApi`)

```typescript
// CRUD operations
GoalsApi.addGoal(data: GoalRequest)
GoalsApi.getGoals()
GoalsApi.updateGoal(id: string, data: Partial<GoalRequest>)
GoalsApi.deleteGoal(id: string)

// Goal progress
GoalsApi.addNewAmount(id: string, amount: number)
GoalsApi.getGoalProgress(id: string)
GoalsApi.getGoalsByType(type: GoalType)
```

### Smart Notes API (`NotesApi`)

```typescript
// CRUD operations
NotesApi.createNote(data: NoteRequest)
NotesApi.updateNote(id: string, data: Partial<NoteRequest>)
NotesApi.getAllNotes()
NotesApi.deleteNote(id: string)

// Additional methods
NotesApi.getNotesByCategory(category: NoteCategory)
NotesApi.getPinnedNotes()
NotesApi.togglePinNote(id: string)
NotesApi.searchNotes(query: string)
NotesApi.getNotesWithReminders()
```

### Notifications API (`NotificationsApi`)

```typescript
// Notification management
NotificationsApi.getNotifications()
NotificationsApi.markRead(id: string)
NotificationsApi.deleteNotification(id: string)
NotificationsApi.deleteAllNotifications()

// Settings
NotificationsApi.getNotiSettings()
NotificationsApi.updateNotiSetting(id: string, enabled: boolean)

// Additional methods
NotificationsApi.getUnreadCount()
NotificationsApi.markAllAsRead()
NotificationsApi.getNotificationsByCategory(category: NotificationCategory)
```

## TypeScript Types

All API responses follow a consistent pattern:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Enums

The API uses TypeScript enums for type safety:

```typescript
enum TaskType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

enum GoalType {
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  PURCHASE = 'purchase',
  TRAVEL = 'travel',
  EDUCATION = 'education',
  HEALTH = 'health',
  OTHER = 'other'
}

enum NoteCategory {
  PERSONAL = 'personal',
  WORK = 'work',
  STUDY = 'study',
  SHOPPING = 'shopping',
  IDEAS = 'ideas',
  REMINDERS = 'reminders',
  OTHER = 'other'
}
```

## Error Handling

All API methods include comprehensive error handling:

```typescript
const result = await API.tasks.createTask(taskData);

if (result.success) {
  // Handle success
  console.log('Task created:', result.data);
} else {
  // Handle error
  console.error('Error creating task:', result.error);
}
```

## Configuration

The axios instance is configured with:

- **Base URL**: `https://api.growupe.com/api`
- **Timeout**: 10 seconds
- **Content-Type**: `application/json`
- **Automatic token management**
- **401 response handling**

## Usage Examples

### Creating a Task

```typescript
import { API, TaskType } from '../services/api';

const newTask = {
  title: 'Complete project',
  description: 'Finish the React Native app',
  type: TaskType.DAILY,
  priority: 'important' as const,
  category: 'daily' as const,
  dueDate: '2024-01-15',
  estimatedDuration: 120,
  notes: 'Focus on the main features'
};

const result = await API.tasks.createTask(newTask);
if (result.success) {
  console.log('Task created:', result.data);
}
```

### Managing Finance

```typescript
import { API, ExpenseCategory } from '../services/api';

// Set income
await API.finance.setIncome('2024-01', 5000);

// Add expense
const expense = {
  title: 'Groceries',
  amount: 150,
  category: ExpenseCategory.FOOD,
  date: '2024-01-10',
  description: 'Weekly groceries',
  isRecurring: true,
  recurringType: 'weekly' as const
};

await API.finance.addExpense(expense);

// Get overview
const overview = await API.finance.getFinanceOverview('2024-01');
```

### Managing Goals

```typescript
import { API, GoalType } from '../services/api';

const goal = {
  title: 'Save for vacation',
  description: 'Save money for summer vacation',
  targetAmount: 3000,
  currentAmount: 500,
  type: GoalType.SAVINGS,
  targetDate: '2024-06-01',
  icon: '🏖️',
  color: '#4CAF50'
};

const result = await API.goals.addGoal(goal);
if (result.success) {
  // Add progress
  await API.goals.addNewAmount(result.data.id, 200);
}
```

## Best Practices

1. **Always check success status** before accessing data
2. **Handle errors gracefully** with user-friendly messages
3. **Use TypeScript types** for better development experience
4. **Cache responses** when appropriate to reduce API calls
5. **Implement loading states** during API calls
6. **Use the convenience API object** for cleaner imports

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Token expired or invalid - handled automatically
2. **Network errors**: Check internet connection and API availability
3. **Type errors**: Ensure you're using the correct TypeScript interfaces
4. **AsyncStorage errors**: Check if AsyncStorage is properly configured

### Debug Mode

Enable debug logging by checking the console for detailed error messages from each API call.
