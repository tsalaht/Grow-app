export interface Task {
  id: string;
  title: string;
  icon: string;
  notes: string;
  status: 'completed' | 'in-progress' | 'overdue' | 'paused';
  priority: 'urgent' | 'important' | 'normal' | 'low';
  date: string;
  time: string;
  estimatedDuration: number;
  progress: number;
  category: 'daily' | 'weekly' | 'monthly';
}
