import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  Pressable,
  RefreshControl,
} from 'react-native';

// Ensure Tajawal is applied to Text/TextInput when fonts are loaded
// We cannot rely on defaultProps before fonts load; we gate render on fontsLoaded
import Slider from '@react-native-community/slider';
import { Feather as Icon } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ReminderModal } from '@/app/Components/ReminderModal';
import TaskCard from '@/app/Components/TaskCard';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
import { Task } from '@/types/Task';
import { Dropdown } from "react-native-element-dropdown";
import { 
  useTasks, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask, 
  useToggleTask,
  useTasksByCategory 
} from '../../hooks/useApiData';
import { TaskType, TaskResponse, TaskRequest } from '../../types/api';
import { API } from '@/services/api';

// Set default font for Text and TextInput across this screen
// Safe to do at module scope and does not affect hooks
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.style = [Text.defaultProps.style, { fontFamily: 'Tajawal_400Regular' }];
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.style = [TextInput.defaultProps.style, { fontFamily: 'Tajawal_400Regular' }];



interface PreDefinedTask {
  title: string;
  icon: string;
  category: string;
}

// Pre-defined tasks data
const preDefinedTasks = {
  daily: [
    { title: 'الذهاب الي الجيم', icon: '🏋️', category: 'صحة' },
    { title: 'بدء يوم العمل ومراجعة المهام', icon: '💼', category: 'عمل' },
    { title: 'قراءة كتاب أو مقال مفيد', icon: '📖', category: 'تطوير' },
    { title: 'تناول وجبات صحية متوازنة', icon: '🍎', category: 'صحة' },
    { title: 'شرب كمية كافية من الماء', icon: '💧', category: 'صحة' },
    { title: 'مراجعة والرد على البريد الإلكتروني', icon: '📧', category: 'عمل' },
    { title: 'جلسة تأمل أو استرخاء', icon: '🧘‍♀️', category: 'صحة' },
    { title: 'ترتيب السرير والغرفة', icon: '🛏️', category: 'منزل' },
    { title: 'متابعة الأخبار والتطورات المهمة', icon: '📱', category: 'عام' },
    { title: 'التخطيط والاستعداد لليوم التالي', icon: '🌅', category: 'تنظيم' },
    { title: 'روتين العناية الشخصية', icon: '🚿', category: 'شخصي' },
    { title: 'تحضير وجبة منزلية', icon: '🍳', category: 'منزل' },
    { title: 'التواصل مع شخص مهم', icon: '📞', category: 'اجتماعي' },
    { title: 'الاستماع للموسيقى أو البودكاست', icon: '🎵', category: 'ترفيه' },
    { title: 'المشي أو النشاط البدني الخفيف', icon: '🚶‍♂️', category: 'صحة' },
    { title: 'تناول الأدوية والفيتامينات', icon: '💊', category: 'صحة' },
    { title: 'ممارسة تمارين ذهنية أو ألغاز', icon: '🧠', category: 'تطوير' },
    { title: 'العناية بالنباتات المنزلية', icon: '🌱', category: 'منزل' },
    { title: 'كتابة المذكرات اليومية', icon: '📝', category: 'شخصي' },
    { title: 'أعمال التنظيف اليومية', icon: '🧹', category: 'منزل' },
  ],
  weekly: [
    { title: 'اجتماع الفريق الأسبوعي', icon: '👥', category: 'عمل' },
    { title: 'زيارة الأهل والأصدقاء', icon: '🏠', category: 'اجتماعي' },
    { title: 'التنظيف الشامل للمنزل', icon: '🧹', category: 'منزل' },
    { title: 'تسوق احتياجات الأسبوع', icon: '🛒', category: 'منزل' },
    { title: 'مراجعة إنجازات الأسبوع', icon: '📊', category: 'تنظيم' },
    { title: 'فحص وصيانة السيارة', icon: '🚗', category: 'صيانة' },
    { title: 'حضور دورة تدريبية أو ورشة عمل', icon: '📚', category: 'تطوير' },
    { title: 'وقت ترفيه ومشاهدة', icon: '🎬', category: 'ترفيه' },
    { title: 'عمل نسخة احتياطية للملفات', icon: '💻', category: 'تقنية' },
    { title: 'التخطيط للأسبوع القادم', icon: '📋', category: 'تنظيم' },
    { title: 'جلسة تمارين مكثفة', icon: '🏋️‍♂️', category: 'صحة' },
    { title: 'مراجعة وتحديث الأهداف', icon: '📝', category: 'تطوير' },
    { title: 'تسوق الملابس والحاجيات', icon: '🛍️', category: 'شخصي' },
    { title: 'ممارسة هواية إبداعية', icon: '🎨', category: 'ترفيه' },
    { title: 'اتصالات عمل مهمة', icon: '📞', category: 'عمل' },
    { title: 'زيارة طبيب أو فحص دوري', icon: '🏥', category: 'صحة' },
    { title: 'نشاط خارجي أو رحلة قصيرة', icon: '🌳', category: 'ترفيه' },
    { title: 'مراجعة الميزانية الأسبوعية', icon: '💰', category: 'مالي' },
    { title: 'تنظيم وترتيب المخزن', icon: '📦', category: 'منزل' },
    { title: 'أعمال صيانة منزلية', icon: '🔧', category: 'صيانة' },
  ],
  monthly: [
    { title: 'دفع الفواتير والالتزامات الشهرية', icon: '💰', category: 'مالي' },
    { title: 'إجراء الفحوصات الطبية الدورية', icon: '🏥', category: 'صحة' },
    { title: 'مراجعة شاملة للميزانية', icon: '📈', category: 'مالي' },
    { title: 'تقييم وتحديث الأهداف طويلة المدى', icon: '🎯', category: 'تطوير' },
    { title: 'تنظيم الوثائق والملفات المهمة', icon: '🗂️', category: 'تنظيم' },
    { title: 'إعداد التقارير الشهرية', icon: '📊', category: 'عمل' },
    { title: 'شراء المستلزمات الأساسية الكبيرة', icon: '🛍️', category: 'منزل' },
    { title: 'أعمال الصيانة والتجديد', icon: '🏠', category: 'صيانة' },
    { title: 'إنهاء قراءة كتاب كامل', icon: '📚', category: 'تطوير' },
    { title: 'وضع خطة الشهر القادم', icon: '🌟', category: 'تنظيم' },
    { title: 'مراجعة الأداء المهني', icon: '💼', category: 'عمل' },
    { title: 'تحديث السيرة الذاتية والملف المهني', icon: '🧾', category: 'عمل' },
    { title: 'الاحتفال بالإنجازات الكبيرة', icon: '🎉', category: 'شخصي' },
    { title: 'تحديث التطبيقات والأنظمة', icon: '📱', category: 'تقنية' },
    { title: 'تقييم الصحة النفسية والذهنية', icon: '🧘‍♀️', category: 'صحة' },
    { title: 'تقييم التطور التعليمي والمهني', icon: '🎓', category: 'تطوير' },
    { title: 'مراجعة الإنجازات والنجاحات', icon: '🏆', category: 'شخصي' },
    { title: 'مراجعة العلاقات الاجتماعية', icon: '📞', category: 'اجتماعي' },
    { title: 'التخطيط للرحلات والإجازات', icon: '🌍', category: 'ترفيه' },
    { title: 'مراجعة الأفكار والمشاريع الجديدة', icon: '💡', category: 'تطوير' },
  ],
};

const TaskManager: React.FC = () => {
  const [fontsLoaded] = useFonts({ Tajawal_400Regular, Tajawal_700Bold });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});
  const [isReminderVisible, setReminderVisible] = useState(false);
  const [isEditReminderVisible, setEditReminderVisible] = useState(false);
  const [priorityPickerVisible, setPriorityPickerVisible] = useState(false);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);

  // Form state
  interface FormData {
    title: string;
    icon: string;
    notes: string;
    priority: 'urgent' | 'important' | 'normal' | 'low';
    date: string;
    time: string;
    estimatedDuration: number;
    category: 'daily' | 'weekly' | 'monthly';
  }

  const [formData, setFormData] = useState<FormData>({
    title: '',
    icon: '',
    notes: '',
    priority: 'normal',
    date: '',
    time: '',
    estimatedDuration: 30,
    category: 'daily',
  });

  const statusData = [
  { label: "جميع الحالات", value: "" },
  { label: "مكتملة ✅", value: "completed" },
  { label: "قيد التنفيذ ⏳", value: "in-progress" },
  { label: "متأخرة 🔴", value: "overdue" },
  { label: "مؤجلة ⏸️", value: "paused" },
];

const priorityData = [
  { label: "جميع الأولويات", value: "" },
  { label: "عاجل 🔥", value: "urgent" },
  { label: "مهم 🟡", value: "important" },
  { label: "عادي 🟢", value: "normal" },
  { label: "منخفض 🔵", value: "low" },
];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: activeTab === 'all' ? (prev.category || 'daily') : activeTab,
    }));
  }, [activeTab]);

  // Fetch tasks from API
  const { data: allTasksData, refetch: refetchAll } = useTasks();
  const { data: byCategoryData, refetch: refetchByCategory } = useTasksByCategory(
    (activeTab === 'all' ? 'daily' : activeTab) as 'daily' | 'weekly' | 'monthly'
  );

  const mapApiTaskToLocal = (t: TaskResponse): Task => {
    const dateStr = t.dueDate || new Date(t.createdAt).toISOString().split('T')[0];
    const timeStr = t.dueDate && t.dueDate.includes('T')
      ? new Date(t.dueDate).toTimeString().slice(0,5)
      : '';
    return {
      id: t.id,
      title: t.title,
      icon: t.icon || '',
      notes: t.notes || t.description || '',
      status: t.status,
      priority: t.priority,
      date: dateStr,
      time: timeStr,
      estimatedDuration: t.estimatedDuration || 30,
      progress: t.progress || 0,
      category: t.category,
    };
  };

  useEffect(() => {
    const source = activeTab === 'all' ? allTasksData : byCategoryData;
    if (source) {
      setTasks(source.map(mapApiTaskToLocal));
    }
  }, [allTasksData, byCategoryData, activeTab]);

  const refetchTasks = () => {
    if (activeTab === 'all') {
      refetchAll();
    } else {
      refetchByCategory();
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const parseDateString = (value?: string): Date => {
    if (!value) return new Date();
    const [y, m, d] = value.split('-').map((v) => parseInt(v, 10));
    if (!y || !m || !d) return new Date();
    return new Date(y, m - 1, d);
  };

  const parseTimeOnDate = (base: Date, value?: string): Date => {
    const result = new Date(base);
    if (value) {
      const [h, m] = value.split(':').map((v) => parseInt(v, 10));
      result.setHours(h || 0, m || 0, 0, 0);
    }
    return result;
  };

  const getCurrentTasks = () => {
    let filteredTasks = activeTab === 'all' ? tasks : tasks.filter((task) => task.category === activeTab);
    if (filterStatus) {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
    }
    if (filterPriority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority);
    }
    return filteredTasks;
  };

  const getFilteredPreDefinedTasks = (): PreDefinedTask[] => {
    const currentPreDefinedTasks: PreDefinedTask[] =
      activeTab === 'all'
        ? ([
            ...preDefinedTasks.daily,
            ...preDefinedTasks.weekly,
            ...preDefinedTasks.monthly,
          ] as PreDefinedTask[])
        : (preDefinedTasks[activeTab as 'daily' | 'weekly' | 'monthly'] as PreDefinedTask[]);
    return currentPreDefinedTasks.filter((task: PreDefinedTask) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getUniqueCategories = (): string[] => {
    const currentPreDefinedTasks: PreDefinedTask[] =
      activeTab === 'all'
        ? ([
            ...preDefinedTasks.daily,
            ...preDefinedTasks.weekly,
            ...preDefinedTasks.monthly,
          ] as PreDefinedTask[])
        : (preDefinedTasks[activeTab as 'daily' | 'weekly' | 'monthly'] as PreDefinedTask[]);
    const categories = currentPreDefinedTasks.map((task: PreDefinedTask) => task.category as string);
    return Array.from(new Set<string>(categories));
  };

  const handleSelectPreDefinedTask = (task: PreDefinedTask) => {
    setFormData((prev) => ({
      ...prev,
      title: task.title,
      icon: task.icon,
    }));
    setShowDropdown(false);
    setSearchTerm('');
    setSelectedCategory('');
  };

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTaskApi } = useUpdateTask();
  const { mutate: deleteTaskApi } = useDeleteTask();
  const { mutate: toggleTaskApi } = useToggleTask();

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    const selectedCategory = (formData.category as 'daily' | 'weekly' | 'monthly') || (activeTab === 'all' ? 'daily' : activeTab);
    const dueDate = formData.date
      ? (formData.time ? new Date(`${formData.date}T${formData.time}:00`) : new Date(`${formData.date}T00:00:00`)).toISOString()
      : undefined;
    const payload: TaskRequest = {
      title: formData.title,
      description: formData.notes || undefined,
      type: (selectedCategory.toUpperCase() as TaskType),
      priority: formData.priority,
      dueDate,
      estimatedDuration: formData.estimatedDuration,
      category: selectedCategory,
      notes: formData.notes || undefined,
      icon: formData.icon || undefined,
    };
    const result = await createTask(payload);
    if (result?.success) {
      setFilterStatus('');
      setFilterPriority('');
      setFormData({
        title: '',
        icon: '',
        notes: '',
        priority: 'normal',
        date: '',
        time: '',
        estimatedDuration: 30,
        category: activeTab === 'all' ? selectedCategory : activeTab,
      });
      setShowAddForm(false);
      refetchTasks();
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    const partial: any = {};
    if (updates.title !== undefined) partial.title = updates.title;
    if (updates.notes !== undefined) partial.notes = updates.notes;
    if (updates.priority !== undefined) partial.priority = updates.priority;
    if (updates.estimatedDuration !== undefined) partial.estimatedDuration = updates.estimatedDuration;
    if (updates.progress !== undefined) {
      partial.progress = updates.progress;
      if (updates.progress === 100) partial.status = 'completed';
      if (updates.progress === 0) partial.status = 'in-progress';
    }
    if (updates.date || updates.time) {
      const base = updates.date || tasks.find(t => t.id === id)?.date;
      const time = updates.time || tasks.find(t => t.id === id)?.time || '00:00';
      if (base) partial.dueDate = new Date(`${base}T${time}:00`).toISOString();
    }
    await updateTaskApi({ id, data: partial });
    refetchTasks();
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            await deleteTaskApi(id);
            refetchTasks();
          },
        },
      ]
    );
  };

  const duplicateTask = (task: Task) => {
    console.log('Duplicating task:', task.id);
    const newTask = {
      ...task,
      id: generateId(),
      title: `نسخة من ${task.title}`,
      status: 'in-progress' as const,
      progress: 0,
    };
    setTasks((prev) => {
      const newTasks = [...prev, newTask];
      console.log('Tasks after duplication:', newTasks.length);
      return newTasks;
    });
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditFormData({
      title: task.title,
      icon: task.icon,
      notes: task.notes,
      priority: task.priority,
      date: task.date,
      time: task.time,
      estimatedDuration: task.estimatedDuration,
    });
  };

  const saveEditTask = async () => {
    if (editingTask && (editFormData.title?.trim() || Object.keys(editFormData).length > 0)) {
      await updateTask(editingTask, editFormData);
      setEditingTask(null);
      setEditFormData({});
    }
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditFormData({});
  };

  const toggleTaskCompletion = async (task: Task) => {
    await toggleTaskApi(task.id);
    refetchTasks();
  };

  const toggleNoteExpansion = (taskId: string) => {
    setExpandedNotes((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };





  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'daily':
        return 'يومية';
      case 'weekly':
        return 'أسبوعية';
      case 'monthly':
        return 'شهرية';
      case 'all':
        return 'الكل';
      default:
        return tab;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'daily':
        return '🗓️';
      case 'weekly':
        return '📅';
      case 'monthly':
        return '📆';
      case 'all':
        return '📋';
      default:
        return '📋';
    }
  };

  const renderTaskCard = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      editingTask={editingTask}
      editFormData={editFormData}
      expandedNotes={expandedNotes}
      onToggleCompletion={toggleTaskCompletion}
      onStartEdit={startEditTask}
      onSaveEdit={saveEditTask}
      onCancelEdit={cancelEditTask}
      onDelete={deleteTask}
      onDuplicate={duplicateTask}
      onUpdateTask={updateTask}
      onToggleNoteExpansion={toggleNoteExpansion}
      onSetEditFormData={setEditFormData}
      onSetEditReminderVisible={setEditReminderVisible}
    />
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 المهام </Text>
        <View style={styles.headerButtons}>
     
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            style={styles.addButton}
          >
            <Icon name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabsContainer}>
        {(['all', 'daily', 'weekly', 'monthly'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text style={styles.tabIcon}>{getTabIcon(tab)}</Text>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
     <View style={styles.filtersContainer}>
      {/* Status Dropdown */}
      <View style={styles.filterPicker}>
        <Dropdown
          style={styles.dropdown}
          data={statusData}
          labelField="label"
          valueField="value"
          placeholder="جميع الحالات"
          value={filterStatus}
          onChange={(item) => setFilterStatus(item.value)}
          selectedTextStyle={styles.pickerText}
          placeholderStyle={styles.pickerText}
        />
      </View>

      {/* Priority Dropdown */}
      <View style={styles.filterPicker}>
        <Dropdown
          style={styles.dropdown}
          data={priorityData}
          labelField="label"
          valueField="value"
          placeholder="جميع الأولويات"
          value={filterPriority}
          onChange={(item) => setFilterPriority(item.value)}
          selectedTextStyle={styles.pickerText}
          placeholderStyle={styles.pickerText}
        />
      </View>
    </View>
      <ScrollView style={styles.mainContent}>
        {showAddForm && (
          <View style={styles.addFormContainer}>
            <View style={styles.addFormHeader}>
              <Text style={styles.addFormTitle}>➕ إضافة مهمة جديدة</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={styles.closeButton}
              >
                <Icon name="x" size={24} color="#12A150" />
              </TouchableOpacity>
            </View>
            <View style={styles.formContent}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>اختر من العناوين الجاهزة</Text>
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}
                  style={styles.dropdownButton}
                >
                  <Text style={styles.dropdownText}>استعراض العناوين الجاهزة</Text>
                  <Icon
                    name={showDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#12A150"
                  />
                </TouchableOpacity>
                {showDropdown && (
                  <Modal
                    visible={showDropdown}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowDropdown(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>اختر من العناوين الجاهزة</Text>
                          <TouchableOpacity
                            onPress={() => setShowDropdown(false)}
                            style={styles.closeModalButton}
                          >
                            <Icon name="x" size={24} color="#12A150" />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.searchSection}>
                          <View style={styles.searchContainer}>
                            <Icon name="search" size={16} color="#12A150" style={styles.searchIcon} />
                            <TextInput
                              style={styles.searchInput}
                              placeholder="بحث في العناوين..."
                              value={searchTerm}
                              onChangeText={setSearchTerm}
                            />
                          </View>
                          <View style={styles.categoryPicker}>
                            <Picker
                              selectedValue={selectedCategory}
                              onValueChange={(value) => setSelectedCategory(value)}
                              style={styles.pickerText}
                              itemStyle={styles.pickerText}
                            >
                              <Picker.Item label="جميع الفئات" value="" />
                              {getUniqueCategories().map((category) => (
                                <Picker.Item key={category} label={category} value={category} />
                              ))}
                            </Picker>
                          </View>
                        </View>
                        <ScrollView style={styles.predefinedList}>
                          {getFilteredPreDefinedTasks().map((item, index) => (
                            <TouchableOpacity
                              key={index.toString()}
                              onPress={() => handleSelectPreDefinedTask(item)}
                              style={styles.predefinedTask}
                            >
                              <Text style={styles.predefinedIcon}>{item.icon}</Text>
                              <View style={styles.predefinedInfo}>
                                <Text style={styles.predefinedTitle}>{item.title}</Text>
                                <View style={styles.categoryBadge}>
                                  <Text style={styles.categoryText}>{item.category}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>عنوان المهمة</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="أدخل عنوان المهمة..."
                    value={formData.title}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
                  />
                  <TextInput
                    style={styles.iconInput}
                    placeholder="🎯"
                    value={formData.icon}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, icon: text }))}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>الملاحظات التفصيلية</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="اكتب الملاحظات التفصيلية للمهمة..."
                  value={formData.notes}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, notes: text }))}
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formGrid}>
                 <View style={styles.formItem}>
                   <Text style={styles.label}>الأولوية</Text>
                   <TouchableOpacity style={styles.input} onPress={() => setPriorityPickerVisible(true)}>
                     <Text style={{ fontSize: 14, color: '#15803d', textAlign: 'right', fontFamily: 'Tajawal_400Regular' }}>
                       {formData.priority === 'urgent' ? 'عاجل 🔥' : formData.priority === 'important' ? 'مهم 🟡' : formData.priority === 'low' ? 'منخفض 🔵' : 'عادي 🟢'}
                     </Text>
                   </TouchableOpacity>
                 </View>
                 <View style={styles.formItem}>
                   <Text style={styles.label}>الفئة</Text>
                   <TouchableOpacity style={styles.input} onPress={() => setCategoryPickerVisible(true)}>
                     <Text style={{ fontSize: 14, color: '#15803d', textAlign: 'right', fontFamily: 'Tajawal_400Regular' }}>
                       {formData.category === 'daily' ? 'يومية' : formData.category === 'weekly' ? 'أسبوعية' : 'شهرية'}
                     </Text>
                   </TouchableOpacity>
                 </View>
                <View style={styles.formItem}>
                  <Text style={styles.label}>المدة (دقيقة)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.estimatedDuration.toString()}
                    onChangeText={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        estimatedDuration: parseInt(text) || 30,
                      }))
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formItem}>
                  <Text style={{...styles.label,textAlign:"right"}}>التاريخ والوقت</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setReminderVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14, color: '#15803d', textAlign: 'right', fontFamily: 'Tajawal_400Regular' }}>
                      {(formData.date && formData.time) ? `${formData.date} ${formData.time}` : 'اختر التاريخ والوقت'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>إضافة المهمة</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.tasksContainer}>
          {getCurrentTasks().length > 0 ? (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {getCurrentTasks().filter((t) => t.status === 'completed').length}
                  </Text>
                  <Text style={styles.statLabel}>مكتملة</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {getCurrentTasks().filter((t) => t.status === 'in-progress').length}
                  </Text>
                  <Text style={styles.statLabel}>قيد التنفيذ</Text>
                </View>
              </View>
              <FlatList
                data={getCurrentTasks()}
                keyExtractor={(item) => item.id}
                renderItem={renderTaskCard}
                style={styles.taskList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>لا توجد مهام بعد</Text>
              <Text style={styles.emptyText}>ابدأ بإضافة مهمة جديدة لتنظيم يومك</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(true)}
                style={styles.addFirstTaskButton}
              >
                <Text style={styles.addFirstTaskText}>إضافة أول مهمة</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <Text style={styles.bottomNavText}>
          {getCurrentTasks().length} مهمة في {getTabLabel(activeTab)}
        </Text>
        <Text style={styles.bottomNavText}>
          متوسط التقدم:{' '}
          {Math.round(
            getCurrentTasks().reduce((acc, task) => acc + task.progress, 0) /
              getCurrentTasks().length || 0
          )}
          %
        </Text>
      </View>
      {/* Reminder modals */}
      <ReminderModal
        visible={isReminderVisible}
        currentReminder={parseTimeOnDate(parseDateString(formData.date), formData.time)}
        onClose={() => setReminderVisible(false)}
        onSetReminder={(date) => {
          setFormData((prev) => ({ ...prev, date: formatDate(date), time: formatTime(date) }));
          setReminderVisible(false);
        }}
      />
      {/* Priority Picker Modal (custom) */}
      <Modal visible={priorityPickerVisible} transparent animationType="fade" onRequestClose={() => setPriorityPickerVisible(false)}>
        <View style={styles.overlayCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>اختر الأولوية</Text>
            {[
              { label: 'عاجل 🔥', value: 'urgent' },
              { label: 'مهم 🟡', value: 'important' },
              { label: 'عادي 🟢', value: 'normal' },
              { label: 'منخفض 🔵', value: 'low' },
            ].map((opt) => (
              <TouchableOpacity key={opt.value} style={styles.modalOption} onPress={() => { setFormData((p) => ({ ...p, priority: opt.value as any })); setPriorityPickerVisible(false); }}>
                <Text style={styles.modalOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setPriorityPickerVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Picker Modal (custom) */}
      <Modal visible={categoryPickerVisible} transparent animationType="fade" onRequestClose={() => setCategoryPickerVisible(false)}>
        <View style={styles.overlayCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>اختر الفئة</Text>
            {[
              { label: 'يومية', value: 'daily' },
              { label: 'أسبوعية', value: 'weekly' },
              { label: 'شهرية', value: 'monthly' },
            ].map((opt) => (
              <TouchableOpacity key={opt.value} style={styles.modalOption} onPress={() => { setFormData((p) => ({ ...p, category: opt.value as any })); setCategoryPickerVisible(false); }}>
                <Text style={styles.modalOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setCategoryPickerVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ReminderModal
        visible={isEditReminderVisible}
        currentReminder={parseTimeOnDate(parseDateString(editFormData.date), editFormData.time)}
        onClose={() => setEditReminderVisible(false)}
        onSetReminder={(date) => {
          setEditFormData((prev) => ({ ...prev, date: formatDate(date), time: formatTime(date) }));
          setEditReminderVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
 backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
   flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#15803d',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#15803d',
    textAlign: 'right',
  },
  headerButtons: {
  flexDirection: 'row-reverse',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#12A150',
  },
  tabsContainer: {
 flexDirection: 'row-reverse',
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tabButton: {
    flex: 1,
   flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#15803d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 4,
    fontFamily: 'Tajawal_400Regular',
  },
  tabText: {
    fontSize: 14,
    color: '#16a34a',
    fontFamily: 'Tajawal_400Regular',
  },
  activeTabText: {
    color: '#15803d',
    fontFamily: 'Tajawal_700Bold',
  },
  filtersContainer: {
 flexDirection: 'row-reverse',
    gap: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  filterPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 12,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  // helper style for Android picker dropdown items
  pickerItemText: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addFormContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#15803d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addFormHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFormTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#15803d',
  },
  closeButton: {
    padding: 8,
  },
  formContent: {
    gap: 16,
  },
  dropdownContainer: {
    gap: 8,
  },
  dropdownButton: {
  flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
  },
  dropdownContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#15803d',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  overlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#15803d',
  },
  modalTitle: {
    fontSize: 16,
    color: '#15803d',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Tajawal_700Bold',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#15803d',
    textAlign: 'center',
    fontFamily: 'Tajawal_400Regular',
  },
  modalCancel: {
    marginTop: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
  },
  modalCancelText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#15803d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#15803d',
    backgroundColor: '#ecfdf5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeModalButton: {
    padding: 8,
  },
  searchSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#15803d',
    backgroundColor: '#f8fafc',
  },
  dropdownSearch: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#15803d',
    backgroundColor: '#ecfdf5',
  },
  searchContainer: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    marginBottom: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  predefinedList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  predefinedTask: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#15803d',
  },
  predefinedIcon: {
    fontSize: 20,
    marginRight: 8,
    fontFamily: 'Tajawal_400Regular',
  },
  predefinedInfo: {
    flex: 1,
  },
  predefinedTitle: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  categoryBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  categoryText: {
    fontSize: 12,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  titleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  iconInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    textAlign: 'center',
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontFamily: 'Tajawal_400Regular',
    height:200
  },
  formGrid: {
 flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  formItem: {
    flex: 1,
    minWidth: (width - 48) / 2,
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#12A150',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Tajawal_700Bold',
  },
  tasksContainer: {
    marginVertical: 12,
  },
  statsContainer: {
 flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#15803d',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#12A150',
  },
  statLabel: {
    fontSize: 12,
    color: '#12A150',
    fontFamily: 'Tajawal_400Regular',
  },
  taskList: {
    flexGrow: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#9ca3af',
    marginBottom: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#15803d',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#12A150',
    marginBottom: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  addFirstTaskButton: {
    backgroundColor: '#12A150',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstTaskText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Tajawal_700Bold',
  },
  bottomNav: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#15803d',
    padding: 12,
    alignItems: 'center',
  },
  bottomNavText: {
    fontSize: 12,
    color: '#12A150',
    textAlign: 'center',
    fontFamily: 'Tajawal_400Regular',
  },
  editContainer: {
    gap: 8,
  },
  editHeader: {
   flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#15803d',
  },
  editButtons: {
 flexDirection: 'row-reverse',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#12A150',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Tajawal_400Regular',
  },
  editForm: {
    gap: 8,
  },
  checkCircleContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#12A150',
    borderColor: '#12A150',
  },
    dropdown: {
    // borderWidth: 1,
    // borderColor: "#15803d",
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: 44,
alignItems:"center",
justifyContent:"center"
  },

});

export default TaskManager;