import { useState, useEffect, useCallback } from 'react';
import { API, TaskType, GoalType, NoteCategory } from '../services/api';

// Generic hook for managing API data
export const useApiData = <T>(
  fetchFunction: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Specific hooks for different data types
export const useTasks = (type?: TaskType) => {
  const fetchTasks = useCallback(() => {
    return type ? API.tasks.getTasks(type) : API.tasks.getAllTasks();
  }, [type]);

  return useApiData(fetchTasks, [type]);
};

export const useGoals = () => {
  return useApiData(API.goals.getGoals);
};

export const useGoalsByType = (type: GoalType) => {
  const fetchGoals = useCallback(() => {
    return API.goals.getGoalsByType(type);
  }, [type]);

  return useApiData(fetchGoals, [type]);
};

export const useNotes = () => {
  return useApiData(API.notes.getAllNotes);
};

export const useNotesByCategory = (category: NoteCategory) => {
  const fetchNotes = useCallback(() => {
    return API.notes.getNotesByCategory(category);
  }, [category]);

  return useApiData(fetchNotes, [category]);
};

export const usePinnedNotes = () => {
  return useApiData(API.notes.getPinnedNotes);
};

// Tasks by category (daily/weekly/monthly)
export const useTasksByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
  const fetchTasks = useCallback(() => {
    return API.tasks.getTasksByCategory(category);
  }, [category]);

  return useApiData(fetchTasks, [category]);
};

export const useFinanceOverview = (month: string) => {
  const fetchOverview = useCallback(() => {
    return API.finance.getFinanceOverview(month);
  }, [month]);

  return useApiData(fetchOverview, [month]);
};

// Summary for last six months
export const useSummarySixMonths = () => {
  return useApiData(API.finance.getSummarySixMonths);
};

export const useIncome = (month: string) => {
  const fetchIncome = useCallback(() => {
    return API.finance.getIncome(month);
  }, [month]);

  return useApiData(fetchIncome, [month]);
};

export const useExpenses = () => {
  return useApiData(API.finance.getAllExpenses);
};

export const useCurrentMonthExpenses = () => {
  return useApiData(API.finance.getCurrentMonthExpenses);
};

export const useObligations = () => {
  return useApiData(API.finance.getObligations);
};

export const useNotifications = () => {
  return useApiData(API.notifications.getNotifications);
};

export const useUnreadNotificationsCount = () => {
  return useApiData(API.notifications.getUnreadCount);
};

export const useNotificationSettings = () => {
  return useApiData(API.notifications.getNotiSettings);
};

// Hook for managing data mutations
export const useApiMutation = <T, R>(
  mutationFunction: (data: T) => Promise<{ success: boolean; data?: R; error?: string }>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data: T) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(data);
      
      if (!result.success) {
        setError(result.error || 'حدث خطأ غير متوقع');
      }
      
      return result;
    } catch (err) {
      const errorMessage = 'حدث خطأ في الاتصال';
      setError(errorMessage);
      console.error('Mutation Error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [mutationFunction]);

  return { mutate, loading, error };
};

// Specific mutation hooks
export const useCreateTask = () => {
  return useApiMutation(API.tasks.createTask);
};

export const useUpdateTask = () => {
  return useApiMutation(({ id, data }: { id: string; data: any }) => 
    API.tasks.updateTask(id, data)
  );
};

export const useDeleteTask = () => {
  return useApiMutation((id: string) => API.tasks.deleteTask(id));
};

export const useToggleTask = () => {
  return useApiMutation((id: string) => API.tasks.toggleTask(id));
};

export const useCreateGoal = () => {
  return useApiMutation(API.goals.addGoal);
};

export const useUpdateGoal = () => {
  return useApiMutation(({ id, data }: { id: string; data: any }) => 
    API.goals.updateGoal(id, data)
  );
};

export const useDeleteGoal = () => {
  return useApiMutation((id: string) => API.goals.deleteGoal(id));
};

export const useAddGoalAmount = () => {
  return useApiMutation(({ id, amount }: { id: string; amount: number }) => 
    API.goals.addNewAmount(id, amount)
  );
};

export const useCreateNote = () => {
  return useApiMutation(API.notes.createNote);
};

export const useUpdateNote = () => {
  return useApiMutation(({ id, data }: { id: string; data: any }) => 
    API.notes.updateNote(id, data)
  );
};

export const useDeleteNote = () => {
  return useApiMutation((id: string) => API.notes.deleteNote(id));
};

export const useTogglePinNote = () => {
  return useApiMutation((id: string) => API.notes.togglePinNote(id));
};

export const useSetIncome = () => {
  return useApiMutation(({ month, amount }: { month: string; amount: number }) => 
    API.finance.setIncome(month, amount)
  );
};

export const useAddExpense = () => {
  return useApiMutation(API.finance.addExpense);
};

export const useUpdateExpense = () => {
  return useApiMutation(({ id, data }: { id: string; data: any }) => 
    API.finance.updateExpense(id, data)
  );
};

export const useDeleteExpense = () => {
  return useApiMutation((id: string) => API.finance.deleteExpense(id));
};

export const useAddObligation = () => {
  return useApiMutation(API.finance.addObligation);
};

export const useUpdateObligation = () => {
  return useApiMutation(({ id, data }: { id: string; data: any }) => 
    API.finance.updateObligation(id, data)
  );
};

export const useDeleteObligation = () => {
  return useApiMutation((id: string) => API.finance.deleteObligation(id));
};

export const useMarkNotificationRead = () => {
  return useApiMutation((id: string) => API.notifications.markRead(id));
};

export const useDeleteNotification = () => {
  return useApiMutation((id: string) => API.notifications.deleteNotification(id));
};

export const useUpdateNotificationSetting = () => {
  return useApiMutation(({ id, enabled }: { id: string; enabled: boolean }) => 
    API.notifications.updateNotiSetting(id, enabled)
  );
};
