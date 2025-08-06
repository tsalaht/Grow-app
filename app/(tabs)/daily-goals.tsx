import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  I18nManager,
  Modal,
} from 'react-native';
import { Target, Plus, Check, X, CreditCard as Edit3, Trash2, Calendar, Bell, User } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: 'daily' | 'weekly' | 'monthly';
  time?: string;
  category: string;
  createdAt: Date;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'قراءة كتاب', 
      completed: false, 
      type: 'daily',
      time: '08:00',
      category: 'تعلم',
      createdAt: new Date() 
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    time: '08:00',
    category: 'عام'
  });
  const [notificationService] = useState(() => NotificationService.getInstance());

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const addTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان المهمة');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      completed: false,
      type: newTask.type,
      time: newTask.time,
      category: newTask.category,
      createdAt: new Date(),
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', type: 'daily', time: '08:00', category: 'عام' });
    setShowAddModal(false);
    
    // جدولة إشعار المهمة
    try {
      const taskData = {
        id: task.id,
        title: task.title,
        reminderTime: task.time || '09:00',
      };
      await notificationService.scheduleDailyTaskReminder(taskData);
    } catch (error) {
      console.error('خطأ في جدولة إشعار المهمة:', error);
    }
    
    Alert.alert('تم الإضافة', 'تم إضافة المهمة بنجاح');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'حذف المهمة',
      'هل أنت متأكد من حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => {
          setTasks(tasks.filter(task => task.id !== id));
        }},
      ]
    );
  };

  const getTasksByType = (type: 'daily' | 'weekly' | 'monthly') => {
    return tasks.filter(task => task.type === type);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <User size={20} color="#374151" />
            </TouchableOpacity>
            <View style={styles.notificationBadge}>
              <Bell size={20} color="#374151" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>
          <Text style={styles.headerTitle}>المهام</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Task Button */}
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addTaskText}>إضافة مهمة</Text>
        </TouchableOpacity>

        {/* Task Management Title */}
        <Text style={styles.sectionTitle}>إدارة المهام</Text>

        {/* Task Categories */}
        <View style={styles.categoriesContainer}>
          {/* Daily Tasks */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#10B981' }]}>
              <Calendar size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryTitle}>المهام اليومية</Text>
            <Text style={styles.categorySubtitle}>كل يوم</Text>
          </TouchableOpacity>

          {/* Weekly Tasks */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#8B5CF6' }]}>
              <Calendar size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryTitle}>المهام الأسبوعية</Text>
            <Text style={styles.categorySubtitle}>كل أسبوع</Text>
          </TouchableOpacity>

          {/* Monthly Tasks */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#3B82F6' }]}>
              <Calendar size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryTitle}>المهام الشهرية</Text>
            <Text style={styles.categorySubtitle}>كل شهر</Text>
          </TouchableOpacity>
        </View>

        {/* Current Tasks */}
        <View style={styles.currentTasksSection}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskLeft}>
                <View style={styles.taskIcon}>
                  <Text style={styles.taskEmoji}>📚</Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>يومياً في {task.time}</Text>
                  <View style={styles.taskBadge}>
                    <Text style={styles.taskBadgeText}>تعلم</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.taskActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => deleteTask(task.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.checkButton, task.completed && styles.checkButtonCompleted]}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed && <Check size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>نصائح لإدارة المهام</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Text style={styles.tipEmoji}>📅</Text>
            </View>
            <Text style={styles.tipText}>خطط مهامك اليومية في بداية كل يوم</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة مهمة جديدة</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="عنوان المهمة..."
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
              textAlign="right"
            />

            <View style={styles.typeSelector}>
              {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newTask.type === type && styles.activeTypeButton
                  ]}
                  onPress={() => setNewTask({...newTask, type})}
                >
                  <Text style={[
                    styles.typeButtonText,
                    newTask.type === type && styles.activeTypeButtonText
                  ]}>
                    {type === 'daily' ? 'يومية' : type === 'weekly' ? 'أسبوعية' : 'شهرية'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="الوقت (مثال: 08:00)"
              value={newTask.time}
              onChangeText={(text) => setNewTask({...newTask, time: text})}
              textAlign="right"
            />

            <TouchableOpacity style={styles.saveButton} onPress={addTask}>
              <Text style={styles.saveButtonText}>حفظ المهمة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#A2E9C1',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#095028',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addTaskText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  currentTasksSection: {
    gap: 12,
    marginBottom: 32,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskEmoji: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'right',
  },
  taskTime: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'right',
  },
  taskBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  taskBadgeText: {
    fontSize: 10,
    fontFamily: 'Tajawal_400Regular',
    color: '#3B82F6',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#095028',
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'right',
  },
  tipCard: {
    backgroundColor: '#A2E9C1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#095028',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#095028',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#095028',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
});