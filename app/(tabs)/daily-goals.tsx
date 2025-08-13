import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

type IconLib = 'Ionicons' | 'MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Types
interface Task {
  id: string;
  title: string;
  icon: string; // legacy emoji icon; kept for backward compatibility
  iconLib?: IconLib;
  iconName?: string; // professional icon name
  notes: string;
  status: 'completed' | 'in-progress' | 'overdue' | 'paused';
  priority: 'urgent' | 'important' | 'normal' | 'low';
  date: string;
  time: string;
  estimatedDuration: number;
  progress: number;
  category: 'daily' | 'weekly' | 'monthly';
}

interface PreDefinedTask {
  title: string;
  iconLib: IconLib;
  iconName: string;
  category: string;
}

// Pre-defined tasks data
const preDefinedTasks: Record<'daily' | 'weekly' | 'monthly', PreDefinedTask[]> = {
  daily: [
    { title: 'الذهاب الي الجيم', iconLib: 'MaterialCommunityIcons', iconName: 'dumbbell', category: 'صحة' },
    { title: 'بدء يوم العمل ومراجعة المهام', iconLib: 'Ionicons', iconName: 'briefcase-outline', category: 'عمل' },
    { title: 'قراءة كتاب أو مقال مفيد', iconLib: 'Ionicons', iconName: 'book-outline', category: 'تطوير' },
    { title: 'تناول وجبات صحية متوازنة', iconLib: 'Ionicons', iconName: 'nutrition-outline', category: 'صحة' },
    { title: 'شرب كمية كافية من الماء', iconLib: 'Ionicons', iconName: 'water-outline', category: 'صحة' },
    { title: 'مراجعة والرد على البريد الإلكتروني', iconLib: 'Ionicons', iconName: 'mail-outline', category: 'عمل' },
    { title: 'جلسة تأمل أو استرخاء', iconLib: 'MaterialCommunityIcons', iconName: 'meditation', category: 'صحة' },
    { title: 'ترتيب السرير والغرفة', iconLib: 'MaterialCommunityIcons', iconName: 'bed-outline', category: 'منزل' },
    { title: 'متابعة الأخبار والتطورات المهمة', iconLib: 'Ionicons', iconName: 'newspaper-outline', category: 'عام' },
    { title: 'التخطيط والاستعداد لليوم التالي', iconLib: 'Ionicons', iconName: 'calendar-outline', category: 'تنظيم' },
  ],
  weekly: [
    { title: 'اجتماع الفريق الأسبوعي', iconLib: 'Ionicons', iconName: 'people-outline', category: 'عمل' },
    { title: 'زيارة الأهل والأصدقاء', iconLib: 'Ionicons', iconName: 'home-outline', category: 'اجتماعي' },
    { title: 'التنظيف الشامل للمنزل', iconLib: 'MaterialCommunityIcons', iconName: 'broom', category: 'منزل' },
    { title: 'تسوق احتياجات الأسبوع', iconLib: 'Ionicons', iconName: 'cart-outline', category: 'منزل' },
    { title: 'مراجعة إنجازات الأسبوع', iconLib: 'Ionicons', iconName: 'stats-chart-outline', category: 'تنظيم' },
    { title: 'فحص وصيانة السيارة', iconLib: 'MaterialCommunityIcons', iconName: 'car-wrench', category: 'صيانة' },
    { title: 'حضور دورة تدريبية أو ورشة عمل', iconLib: 'Ionicons', iconName: 'school-outline', category: 'تطوير' },
    { title: 'وقت ترفيه ومشاهدة', iconLib: 'Ionicons', iconName: 'film-outline', category: 'ترفيه' },
  ],
  monthly: [
    { title: 'دفع الفواتير والالتزامات الشهرية', iconLib: 'Ionicons', iconName: 'card-outline', category: 'مالي' },
    { title: 'إجراء الفحوصات الطبية الدورية', iconLib: 'Ionicons', iconName: 'medkit-outline', category: 'صحة' },
    { title: 'مراجعة شاملة للميزانية', iconLib: 'Ionicons', iconName: 'bar-chart-outline', category: 'مالي' },
    { title: 'تقييم وتحديث الأهداف طويلة المدى', iconLib: 'Ionicons', iconName: 'target-outline', category: 'تطوير' },
    { title: 'تنظيم الوثائق والملفات المهمة', iconLib: 'Ionicons', iconName: 'folder-open-outline', category: 'تنظيم' },
    { title: 'إعداد التقارير الشهرية', iconLib: 'Ionicons', iconName: 'document-text-outline', category: 'عمل' },
  ]
};

type FormState = {
  title: string;
  icon: string;
  notes: string;
  priority: 'urgent' | 'important' | 'normal' | 'low';
  date: string;
  time: string;
  estimatedDuration: number;
  category: 'daily' | 'weekly' | 'monthly';
  iconLib: IconLib;
  iconName: string;
};

const dailyGoals: React.FC = () => {
  const [fontsLoaded] = useFonts({ Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreDefinedTasks, setShowPreDefinedTasks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});
  
  // Form state
  const [formData, setFormData] = useState<FormState>({
    title: '',
    icon: '',
    notes: '',
    priority: 'normal' as const,
    date: '',
    time: '',
    estimatedDuration: 30,
    category: activeTab,
    iconLib: 'Ionicons',
    iconName: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, category: activeTab }));
  }, [activeTab]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getCurrentTasks = () => {
    return tasks.filter(task => task.category === activeTab);
  };

  const getFilteredPreDefinedTasks = () => {
    const currentPreDefinedTasks = preDefinedTasks[activeTab];
    return currentPreDefinedTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getUniqueCategories = () => {
    const currentPreDefinedTasks = preDefinedTasks[activeTab];
    return [...new Set(currentPreDefinedTasks.map(task => task.category))];
  };

  const handleSelectPreDefinedTask = (task: PreDefinedTask) => {
    setFormData(prev => ({
      ...prev,
      title: task.title,
      icon: '',
      iconLib: task.iconLib,
      iconName: task.iconName
    }));
    setShowPreDefinedTasks(false);
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      const newTask: Task = {
        id: generateId(),
        title: formData.title,
        icon: formData.icon,
        iconLib: formData.iconName ? formData.iconLib : undefined,
        iconName: formData.iconName || undefined,
        notes: formData.notes,
        status: 'in-progress',
        priority: formData.priority,
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || '09:00',
        estimatedDuration: formData.estimatedDuration,
        progress: 0,
        category: activeTab
      };
      
      setTasks(prev => [...prev, newTask]);
      setFormData({
        title: '',
        icon: '',
        notes: '',
        priority: 'normal',
        date: '',
        time: '',
        estimatedDuration: 30,
        category: activeTab,
        iconLib: 'Ionicons',
        iconName: ''
      });
      setShowAddForm(false);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'حذف المهمة',
      'هل أنت متأكد من حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => {
          setTasks(prev => prev.filter(task => task.id !== id));
        }}
      ]
    );
  };

  const duplicateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: generateId(),
      title: `نسخة من ${task.title}`,
      status: 'in-progress' as const,
      progress: 0
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskCompletion = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    const newProgress = newStatus === 'completed' ? 100 : task.progress;
    updateTask(task.id, { status: newStatus, progress: newProgress });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#fee2e2';
      case 'important': return '#fef3c7';
      case 'normal': return '#dcfce7';
      case 'low': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'important': return 'مهم';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
      default: return 'عادي';
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'daily': return 'يومية';
      case 'weekly': return 'أسبوعية';
      case 'monthly': return 'شهرية';
      default: return tab;
    }
  };

  const renderIcon = (
    lib: IconLib,
    name: string,
    size = 24,
    color = '#15803d'
  ) => {
    if (!name) return null;
    if (lib === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    }
    return <Ionicons name={name as any} size={size} color={color} />;
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          {renderIcon(
            task.iconName ? (task.iconLib || 'Ionicons') : 'Ionicons',
            task.iconName || 'list-outline',
            24,
            '#15803d'
          )}
          <View style={styles.taskDetails}>
            <Text style={[
              styles.taskTitle,
              task.status === 'completed' && styles.completedTask
            ]}>
              {task.title}
            </Text>
            <View style={styles.taskMeta}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>{getPriorityLabel(task.priority)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="calendar-outline" size={12} color="#16a34a" />
                <Text style={styles.taskDate}>{task.date}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => toggleTaskCompletion(task)}
          style={[
            styles.completionButton,
            task.status === 'completed' && styles.completedButton
          ]}
        >
          {task.status === 'completed' ? (
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
          ) : (
            <Ionicons name="ellipse-outline" size={20} color="#6b7280" />
          )}
        </TouchableOpacity>
      </View>

      {task.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{task.notes}</Text>
        </View>
      )}

      {task.status !== 'completed' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>التقدم</Text>
            <Text style={styles.progressValue}>{task.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${task.progress}%` }
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.taskActions}>
        <TouchableOpacity
          onPress={() => duplicateTask(task)}
          style={styles.actionButton}
        >
          <Ionicons name="copy-outline" size={18} color="#1f2937" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => deleteTask(task.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
        </TouchableOpacity>
        
        <View style={styles.durationContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={14} color="#16a34a" />
            <Text style={styles.durationText}>{task.estimatedDuration} دقيقة</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
        {!fontsLoaded && null}
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}> المهام</Text>
          
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tasks List */}
        <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
          {getCurrentTasks().length > 0 ? (
            <>
              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {getCurrentTasks().filter(t => t.status === 'completed').length}
                  </Text>
                  <Text style={styles.statLabel}>مكتملة</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {getCurrentTasks().filter(t => t.status === 'in-progress').length}
                  </Text>
                  <Text style={styles.statLabel}>قيد التنفيذ</Text>
                </View>
              </View>

              {/* Tasks */}
              {getCurrentTasks().map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </>
          ) : (
              <View style={styles.emptyState}>
                <View style={{ marginBottom: 16 }}>
                  <Ionicons name="document-text-outline" size={64} color="#94a3b8" />
                </View>
                <Text style={styles.emptyTitle}>لا توجد مهام بعد</Text>
                <Text style={styles.emptySubtitle}>ابدأ بإضافة مهمة جديدة لتنظيم يومك</Text>
                <TouchableOpacity
                  onPress={() => setShowAddForm(true)}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonText}>إضافة أول مهمة</Text>
                </TouchableOpacity>
              </View>
          )}
        </ScrollView>

        {/* Add Task Modal */}
        <Modal
          visible={showAddForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة مهمة جديدة</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Pre-defined Tasks Button */}
              <TouchableOpacity
                onPress={() => setShowPreDefinedTasks(true)}
                style={styles.preDefinedButton}
              >
                <Text style={styles.preDefinedButtonText}>استعراض العناوين الجاهزة</Text>
                <Ionicons name="document-text-outline" size={20} color="#15803d" />
              </TouchableOpacity>

              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>عنوان المهمة</Text>
                <View style={styles.titleInputContainer}>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="أدخل عنوان المهمة..."
                    value={formData.title}
                    onChangeText={(text) => setFormData(prev => ({...prev, title: text}))}
                    multiline
                  />
                </View>
              </View>

              {/* Icon Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الأيقونة</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.iconPickerContainer}
                >
                  {[
                    { lib: 'MaterialCommunityIcons' as const, name: 'dumbbell' },
                    { lib: 'Ionicons' as const, name: 'book-outline' },
                    { lib: 'Ionicons' as const, name: 'water-outline' },
                    { lib: 'Ionicons' as const, name: 'mail-outline' },
                    { lib: 'MaterialCommunityIcons' as const, name: 'meditation' },
                    { lib: 'MaterialCommunityIcons' as const, name: 'broom' },
                    { lib: 'Ionicons' as const, name: 'calendar-outline' },
                    { lib: 'Ionicons' as const, name: 'people-outline' },
                    { lib: 'Ionicons' as const, name: 'cart-outline' },
                    { lib: 'Ionicons' as const, name: 'stats-chart-outline' },
                    { lib: 'Ionicons' as const, name: 'cash-outline' },
                    { lib: 'Ionicons' as const, name: 'document-text-outline' },
                  ].map((ic) => (
                    <TouchableOpacity
                      key={`${ic.lib}:${ic.name}`}
                      onPress={() => setFormData(prev => ({...prev, iconLib: ic.lib, iconName: ic.name}))}
                      style={[
                        styles.iconOption,
                        formData.iconLib === ic.lib && formData.iconName === ic.name && styles.selectedIconOption,
                      ]}
                    >
                      {renderIcon(ic.lib, ic.name, 24, '#15803d')}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Notes Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الملاحظات التفصيلية</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="اكتب الملاحظات التفصيلية للمهمة..."
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({...prev, notes: text}))}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Priority and Duration */}
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>الأولوية</Text>
                  <View style={styles.priorityContainer}>
                    {['urgent', 'important', 'normal', 'low'].map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => setFormData(prev => ({...prev, priority: priority as any}))}
                        style={[
                          styles.priorityOption,
                          formData.priority === priority && styles.selectedPriority,
                          { backgroundColor: getPriorityColor(priority) }
                        ]}
                      >
                        <Text style={styles.priorityOptionText}>
                          {getPriorityLabel(priority)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>المدة (دقيقة)</Text>
                  <TextInput
                    style={styles.durationInput}
                    placeholder="30"
                    value={formData.estimatedDuration.toString()}
                    onChangeText={(text) => setFormData(prev => ({
                      ...prev, 
                      estimatedDuration: parseInt(text) || 30
                    }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>إضافة المهمة</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

              {/* Pre-defined Tasks Modal */}
        <Modal
          visible={showPreDefinedTasks}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>العناوين الجاهزة</Text>
              <TouchableOpacity
                onPress={() => setShowPreDefinedTasks(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="بحث في العناوين..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>

            <ScrollView style={styles.preDefinedList}>
              {getFilteredPreDefinedTasks().map((task, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectPreDefinedTask(task)}
                  style={styles.preDefinedItem}
                >
                  {renderIcon(task.iconLib, task.iconName, 24, '#15803d')}
                  <View style={styles.preDefinedInfo}>
                    <Text style={styles.preDefinedTitle}>{task.title}</Text>
                    <Text style={styles.preDefinedCategory}>{task.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  headerTitle: {
    fontSize: 18,

    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_700Bold',
  },
  addButton: {
    backgroundColor: '#16a34a',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#dcfce7',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#16a34a',

    fontFamily: 'Tajawal_500Medium',
  },
  activeTabText: {
    color: '#15803d',

    fontFamily: 'Tajawal_700Bold',
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  statNumber: {
    fontSize: 24,

    color: '#16a34a',
    fontFamily: 'Tajawal_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
    fontFamily: 'Tajawal_400Regular',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  taskIcon: {
    fontSize: 24,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,

    color: '#1f2937',
    textAlign: 'right',
    lineHeight: 22,
    fontFamily: 'Tajawal_700Bold',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#16a34a',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,

    fontFamily: 'Tajawal_500Medium',
  },
  taskDate: {
    fontSize: 10,
    color: '#16a34a',
    fontFamily: 'Tajawal_400Regular',
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  completedButton: {
    backgroundColor: '#dcfce7',
  },
  completionButtonText: {
    fontSize: 16,
  },
  notesContainer: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#15803d',
    textAlign: 'right',
    lineHeight: 18,
    fontFamily: 'Tajawal_400Regular',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Tajawal_400Regular',
  },
  progressValue: {
    fontSize: 12,
    color: '#15803d',
 
    fontFamily: 'Tajawal_700Bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#dcfce7',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 2,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#16a34a',
    fontFamily: 'Tajawal_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,

    color: '#15803d',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Tajawal_700Bold',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Tajawal_400Regular',
  },
  emptyButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,

    fontFamily: 'Tajawal_700Bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  modalTitle: {
    fontSize: 18,
    color: '#15803d',
    fontFamily: 'Tajawal_700Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  preDefinedButton: {
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  preDefinedButtonText: {
    fontSize: 16,
    color: '#15803d',

    fontFamily: 'Tajawal_500Medium',
  },
  preDefinedButtonIcon: {
    fontSize: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#15803d',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'Tajawal_500Medium',
  },
  titleInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  titleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: 'white',
    fontFamily: 'Tajawal_400Regular',
  },
  iconInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    textAlign: 'right',
    backgroundColor: 'white',
    minHeight: 100,
    fontFamily: 'Tajawal_400Regular',
    paddingVertical:8
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  priorityContainer: {
    gap: 8,
  },
  priorityOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  priorityOptionText: {
    fontSize: 12,
    textAlign: 'center',
 
    fontFamily: 'Tajawal_500Medium',
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'white',
    fontFamily: 'Tajawal_400Regular',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom:60
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,

    fontFamily: 'Tajawal_700Bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#dcfce7',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
  },
  preDefinedList: {
    flex: 1,
  },
  iconPickerContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  iconOption: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dcfce7',
    marginRight: 8,
  },
  selectedIconOption: {
    borderColor: '#16a34a',
    borderWidth: 2,
  },
  preDefinedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  preDefinedIcon: {
    fontSize: 24,
  },
  preDefinedInfo: {
    flex: 1,
  },
  preDefinedTitle: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
    fontFamily: 'Tajawal_500Medium',
  },
  preDefinedCategory: {
    fontSize: 12,
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-end',
    fontFamily: 'Tajawal_400Regular',
  },
});

export default dailyGoals;