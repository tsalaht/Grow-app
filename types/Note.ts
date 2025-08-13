export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  reminder?: Date | null;
  tags?: string[];
  isTask?: boolean;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export type FilterType = 'all' | 'reminders' | 'pinned' | 'tags';

export interface ReminderSettings {
  date: Date;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
}