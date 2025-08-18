# API Integration Guide for GROWUPE

This guide explains how to integrate the API layer into your GROWUPE application.

## 🚀 Quick Start

### 1. Authentication Integration

The authentication is already integrated into the context. Users can now:
- Login with Google OAuth
- Stay logged in across app sessions
- Automatic logout on 401 responses

```typescript
// In any component
import { useMyAppContext } from '@/context/MyAppContext';

const { login, logout, isAuthenticated, userData } = useMyAppContext();
```

### 2. Using API Hooks

The API hooks provide easy access to all backend data:

```typescript
import { 
  useTasks, 
  useGoals, 
  useNotes, 
  useFinanceOverview,
  useCreateTask,
  useUpdateTask 
} from '../../hooks/useApiData';

// In your component
const { data: tasks, loading, error, refetch } = useTasks();
const { mutate: createTask, loading: creating } = useCreateTask();
```

## 📋 Available Hooks

### Data Fetching Hooks

| Hook | Description | Parameters |
|------|-------------|------------|
| `useTasks(type?)` | Get tasks (optionally filtered by type) | `TaskType` (optional) |
| `useGoals()` | Get all goals | None |
| `useGoalsByType(type)` | Get goals by type | `GoalType` |
| `useNotes()` | Get all notes | None |
| `useNotesByCategory(category)` | Get notes by category | `NoteCategory` |
| `usePinnedNotes()` | Get pinned notes | None |
| `useFinanceOverview(month)` | Get finance overview | `string` (YYYY-MM) |
| `useIncome(month)` | Get income for month | `string` (YYYY-MM) |
| `useExpenses()` | Get all expenses | None |
| `useCurrentMonthExpenses()` | Get current month expenses | None |
| `useObligations()` | Get all obligations | None |
| `useNotifications()` | Get all notifications | None |
| `useUnreadNotificationsCount()` | Get unread count | None |
| `useNotificationSettings()` | Get notification settings | None |

### Mutation Hooks

| Hook | Description | Parameters |
|------|-------------|------------|
| `useCreateTask()` | Create new task | `TaskRequest` |
| `useUpdateTask()` | Update task | `{ id, data }` |
| `useDeleteTask()` | Delete task | `string` (id) |
| `useToggleTask()` | Toggle task completion | `string` (id) |
| `useCreateGoal()` | Create new goal | `GoalRequest` |
| `useUpdateGoal()` | Update goal | `{ id, data }` |
| `useDeleteGoal()` | Delete goal | `string` (id) |
| `useAddGoalAmount()` | Add amount to goal | `{ id, amount }` |
| `useCreateNote()` | Create new note | `NoteRequest` |
| `useUpdateNote()` | Update note | `{ id, data }` |
| `useDeleteNote()` | Delete note | `string` (id) |
| `useTogglePinNote()` | Toggle note pin | `string` (id) |
| `useSetIncome()` | Set income | `{ month, amount }` |
| `useAddExpense()` | Add expense | `Expense` |
| `useUpdateExpense()` | Update expense | `{ id, data }` |
| `useDeleteExpense()` | Delete expense | `string` (id) |
| `useAddObligation()` | Add obligation | `Obligation` |
| `useUpdateObligation()` | Update obligation | `{ id, data }` |
| `useDeleteObligation()` | Delete obligation | `string` (id) |
| `useMarkNotificationRead()` | Mark notification read | `string` (id) |
| `useDeleteNotification()` | Delete notification | `string` (id) |
| `useUpdateNotificationSetting()` | Update notification setting | `{ id, enabled }` |

## 🔧 Implementation Examples

### Example 1: Tasks Screen

```typescript
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTasks, useCreateTask, useToggleTask } from '../../hooks/useApiData';
import { TaskType } from '../../types/api';

export default function TasksScreen() {
  const [selectedType, setSelectedType] = useState<TaskType>(TaskType.DAILY);
  
  // Fetch tasks
  const { data: tasks, loading, error, refetch } = useTasks(selectedType);
  
  // Mutations
  const { mutate: createTask, loading: creating } = useCreateTask();
  const { mutate: toggleTask, loading: toggling } = useToggleTask();

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      refetch(); // Refresh the list
      Alert.alert('نجح', 'تم إنشاء المهمة بنجاح');
    } else {
      Alert.alert('خطأ', result.error || 'فشل في إنشاء المهمة');
    }
  };

  const handleToggleTask = async (taskId) => {
    const result = await toggleTask(taskId);
    if (result.success) {
      refetch(); // Refresh the list
    }
  };

  if (loading) {
    return <Text>جاري التحميل...</Text>;
  }

  if (error) {
    return <Text>خطأ: {error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
            <Text>{item.title}</Text>
            <Text>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

### Example 2: Finance Screen

```typescript
import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useFinanceOverview, useIncome, useExpenses } from '../../hooks/useApiData';

export default function FinanceScreen() {
  const currentMonth = '2024-01'; // You can make this dynamic
  
  const { 
    data: overview, 
    loading: overviewLoading, 
    refetch: refetchOverview 
  } = useFinanceOverview(currentMonth);
  
  const { 
    data: income, 
    loading: incomeLoading, 
    refetch: refetchIncome 
  } = useIncome(currentMonth);
  
  const { 
    data: expenses, 
    loading: expensesLoading, 
    refetch: refetchExpenses 
  } = useExpenses();

  const onRefresh = async () => {
    await Promise.all([
      refetchOverview(),
      refetchIncome(),
      refetchExpenses(),
    ]);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={overviewLoading} onRefresh={onRefresh} />
      }
    >
      {overview && (
        <View>
          <Text>إجمالي الدخل: ${overview.totalIncome}</Text>
          <Text>إجمالي المصروفات: ${overview.totalExpenses}</Text>
          <Text>المتبقي: ${overview.remainingAmount}</Text>
        </View>
      )}
      
      {expenses && (
        <View>
          <Text>المصروفات:</Text>
          {expenses.map(expense => (
            <Text key={expense.id}>
              {expense.title}: ${expense.amount}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
```

### Example 3: Goals Screen with Progress

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useGoals, useAddGoalAmount } from '../../hooks/useApiData';

export default function GoalsScreen() {
  const { data: goals, loading, refetch } = useGoals();
  const { mutate: addAmount, loading: adding } = useAddGoalAmount();

  const handleAddAmount = async (goalId, amount) => {
    const result = await addAmount({ id: goalId, amount });
    if (result.success) {
      refetch();
      Alert.alert('نجح', 'تم إضافة المبلغ بنجاح');
    } else {
      Alert.alert('خطأ', result.error || 'فشل في إضافة المبلغ');
    }
  };

  return (
    <View>
      {goals?.map(goal => (
        <View key={goal.id}>
          <Text>{goal.title}</Text>
          <Text>التقدم: {goal.progress}%</Text>
          <Text>المبلغ الحالي: ${goal.currentAmount}</Text>
          <Text>الهدف: ${goal.targetAmount}</Text>
          
          <TouchableOpacity 
            onPress={() => handleAddAmount(goal.id, 100)}
            disabled={adding}
          >
            <Text>إضافة 100$</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
```

## 🔐 Authentication Flow

### 1. Login Process

```typescript
// In login screen
import { useMyAppContext } from '@/context/MyAppContext';

const { login, isLoading } = useMyAppContext();

const handleGoogleLogin = async (idToken) => {
  const fcmToken = 'your-fcm-token'; // Get from notification service
  const success = await login(idToken, fcmToken);
  
  if (success) {
    // Navigate to main app
    router.replace('/(tabs)');
  } else {
    // Show error message
    Alert.alert('خطأ في تسجيل الدخول', 'يرجى المحاولة مرة أخرى');
  }
};
```

### 2. Check Authentication Status

```typescript
// In app layout or main screen
import { useMyAppContext } from '@/context/MyAppContext';

const { isAuthenticated, isLoading } = useMyAppContext();

if (isLoading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <MainApp />;
```

### 3. Logout

```typescript
import { useMyAppContext } from '@/context/MyAppContext';

const { logout } = useMyAppContext();

const handleLogout = async () => {
  await logout();
  // User will be redirected to login automatically
};
```

## 🎯 Best Practices

### 1. Error Handling

Always handle API errors gracefully:

```typescript
const { data, loading, error } = useTasks();

if (error) {
  return (
    <View>
      <Text>حدث خطأ: {error}</Text>
      <TouchableOpacity onPress={refetch}>
        <Text>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 2. Loading States

Show loading indicators during API calls:

```typescript
const { loading, data } = useTasks();
const { mutate: createTask, loading: creating } = useCreateTask();

if (loading) {
  return <ActivityIndicator size="large" />;
}

return (
  <View>
    <FlatList data={data} />
    <TouchableOpacity disabled={creating}>
      <Text>{creating ? 'جاري الإنشاء...' : 'إضافة مهمة'}</Text>
    </TouchableOpacity>
  </View>
);
```

### 3. Data Refresh

Use pull-to-refresh or manual refresh:

```typescript
const { data, refetch } = useTasks();

return (
  <ScrollView
    refreshControl={
      <RefreshControl refreshing={false} onRefresh={refetch} />
    }
  >
    {/* Your content */}
  </ScrollView>
);
```

### 4. Optimistic Updates

For better UX, update UI immediately and revert on error:

```typescript
const { mutate: toggleTask } = useToggleTask();

const handleToggle = async (taskId) => {
  // Optimistically update UI
  const updatedTasks = tasks.map(task => 
    task.id === taskId 
      ? { ...task, status: task.status === 'completed' ? 'in-progress' : 'completed' }
      : task
  );
  setTasks(updatedTasks);

  // Make API call
  const result = await toggleTask(taskId);
  
  if (!result.success) {
    // Revert on error
    setTasks(tasks);
    Alert.alert('خطأ', 'فشل في تحديث المهمة');
  }
};
```

## 🔧 Configuration

### 1. Google OAuth Setup

Update the Google OAuth configuration in `app/login.tsx`:

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
D',
  androidClientId: '316613776863-n5po0gp8sh925567o9a0m1ceufae7t0k.apps.googleusercontent.com',
});
```

### 2. API Base URL

The API base URL is configured in `services/api/axiosInstance.ts`:

```typescript
const axiosInstance = axios.create({
  baseURL: 'https://api.growupe.com/api',
  // ... other config
});
```

### 3. Token Storage

Tokens are automatically stored in AsyncStorage with keys:
- `authToken`: JWT token
- `userData`: User information

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Token expired - handled automatically
2. **Network errors**: Check internet connection
3. **Type errors**: Ensure correct TypeScript interfaces
4. **Loading not working**: Check if hooks are properly imported

### Debug Mode

Enable debug logging by checking console for detailed error messages from each API call.

## 📚 Next Steps

1. **Complete Integration**: Update all screens to use API hooks
2. **Error Boundaries**: Add error boundaries for better error handling
3. **Offline Support**: Implement offline caching with React Query
4. **Real-time Updates**: Add WebSocket support for real-time notifications
5. **Performance**: Implement pagination for large data sets

## 🆘 Support

If you encounter issues:

1. Check the console for error messages
2. Verify API endpoints are accessible
3. Ensure authentication tokens are valid
4. Check network connectivity
5. Review the API documentation for endpoint details

The API integration is now ready to use! Start by updating your existing screens to use the provided hooks instead of mock data.
