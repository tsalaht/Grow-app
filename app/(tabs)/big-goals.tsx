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
  Modal,
  Platform,
} from 'react-native';
import { Trophy, Plus, Target, Calendar, DollarSign, ChevronDown, X, Heart, Car, Home, Briefcase, GraduationCap, Edit, Minus } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';
import DatePickerModal from '@/app/Components/datePicker';

interface BigGoal {
  id: string;
  type: string;
  name: string;
  totalCost: number;
  currentAmount: number;
  monthlyAmount: number;
  targetDate: {
    day: number;
    month: string;
    year: number;
  };
  createdAt: Date;
}

const goalTypes = [
  { id: 'marriage', name: 'الزواج', icon: <Heart size={20} color="#EC4899" /> },
  { id: 'car', name: 'شراء سيارة', icon: <Car size={20} color="#3B82F6" /> },
  { id: 'house', name: 'شراء منزل', icon: <Home size={20} color="#10B981" /> },
  { id: 'business', name: 'بدء مشروع', icon: <Briefcase size={20} color="#F59E0B" /> },
  { id: 'education', name: 'التعليم', icon: <GraduationCap size={20} color="#8B5CF6" /> },
  { id: 'other', name: 'أخرى', icon: <Target size={20} color="#6B7280" /> },
];

const months = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

export default function BigGoalsScreen() {
  const [goals, setGoals] = useState<BigGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showGoalTypeModal, setShowGoalTypeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationService] = useState(() => NotificationService.getInstance());

  const [newGoal, setNewGoal] = useState({
    type: '',
    name: '',
    totalCost: '',
    currentAmount: '',
    monthlyAmount: '',
    targetDate: {
      day: 5,
      month: 'أغسطس',
      year: 2025,
    }
  });

  const [editingGoal, setEditingGoal] = useState<BigGoal | null>(null);
  const [editMonthlyAmount, setEditMonthlyAmount] = useState('');
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [goalToAdjust, setGoalToAdjust] = useState<BigGoal | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const resetForm = () => {
    setNewGoal({
      type: '',
      name: '',
      totalCost: '',
      currentAmount: '',
      monthlyAmount: '',
      targetDate: {
        day: 5,
        month: 'أغسطس',
        year: 2025,
      }
    });
  };

  const calculateYearsRemaining = (goal: BigGoal) => {
    const targetDate = new Date(goal.targetDate.year, months.indexOf(goal.targetDate.month), goal.targetDate.day);
    const currentDate = new Date();
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    const monthsDiff = daysDiff / 30.44; // Average days per month
    const yearsDiff = monthsDiff / 12;
    return Math.max(0, Math.ceil(yearsDiff));
  };

  const calculateMonthsToGoal = (goal: BigGoal) => {
    const remainingAmount = goal.totalCost - goal.currentAmount;
    if (goal.monthlyAmount <= 0) return Infinity;
    return Math.ceil(remainingAmount / goal.monthlyAmount);
  };

  const formatTimeToGoal = (months: number) => {
    if (months === Infinity) return 'لا يمكن الوصول بالمدخرات الحالية';
    if (months <= 0) return 'تم الوصول للهدف';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} شهر`;
    if (remainingMonths === 0) return `${years} سنة`;
    return `${years} سنة و ${remainingMonths} شهر`;
  };

  const openAdjustModal = (goal: BigGoal) => {
    setGoalToAdjust(goal);
    setAdjustAmount('');
    setShowAdjustForm(true);
  };

  const applyAdjustment = (type: 'add' | 'subtract') => {
    if (!goalToAdjust) return;
    const numericAmount = parseFloat(adjustAmount);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('قيمة غير صالحة', 'يرجى إدخال مبلغ صالح');
      return;
    }

    let updatedCurrent =
      type === 'add'
        ? goalToAdjust.currentAmount + numericAmount
        : goalToAdjust.currentAmount - numericAmount;
    if (updatedCurrent < 0) updatedCurrent = 0;
    if (updatedCurrent > goalToAdjust.totalCost) updatedCurrent = goalToAdjust.totalCost;

    const updatedGoals = goals.map((g) =>
      g.id === goalToAdjust.id ? { ...g, currentAmount: updatedCurrent } : g
    );
    setGoals(updatedGoals);
    setShowAdjustForm(false);
    setGoalToAdjust(null);
    setAdjustAmount('');
    Alert.alert('تم', 'تم تحديث رصيد الهدف');
  };

  const saveGoal = async () => {
    if (!newGoal.type || !newGoal.name || !newGoal.totalCost) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const goal: BigGoal = {
      id: Date.now().toString(),
      type: newGoal.type,
      name: newGoal.name,
      totalCost: parseFloat(newGoal.totalCost),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      monthlyAmount: parseFloat(newGoal.monthlyAmount) || 0,
      targetDate: newGoal.targetDate,
      createdAt: new Date(),
    };

    setGoals([...goals, goal]);
    resetForm();
    setShowAddForm(false);
    
    // جدولة إشعار تذكير الادخار الشهري
    try {
      if (goal.monthlyAmount > 0) {
        await notificationService.scheduleBigGoalSavingReminder(goal);
      }
    } catch (error) {
      console.error('خطأ في جدولة إشعار الهدف الكبير:', error);
    }
    
    Alert.alert('تم الحفظ', 'تم إضافة الهدف بنجاح');
  };

  const openEditModal = (goal: BigGoal) => {
    setEditingGoal(goal);
    setEditMonthlyAmount(goal.monthlyAmount.toString());
    setShowEditForm(true);
  };

  const saveEdit = async () => {
    if (!editingGoal) return;

    const newMonthlyAmount = parseFloat(editMonthlyAmount) || 0;
    
    const updatedGoal = {
      ...editingGoal,
      monthlyAmount: newMonthlyAmount,
    };

    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id ? updatedGoal : goal
    );

    setGoals(updatedGoals);
    setShowEditForm(false);
    setEditingGoal(null);
    setEditMonthlyAmount('');

    // تحديث الإشعارات
    try {
      if (newMonthlyAmount > 0) {
        await notificationService.scheduleBigGoalSavingReminder(updatedGoal);
      }
    } catch (error) {
      console.error('خطأ في تحديث إشعار الهدف الكبير:', error);
    }

    Alert.alert('تم التحديث', 'تم تحديث المبلغ الشهري بنجاح');
  };

  const getSelectedGoalType = () => {
    const selected = goalTypes.find(type => type.id === newGoal.type);
    return selected ? selected.name : 'اختر نوع الهدف';
  };

  if (!fontsLoaded) {
    return null;
  }

  if (showAddForm) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowAddForm(false);
              resetForm();
            }}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>إضافة هدف مالي جديد</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* نوع الهدف */}
          <Text style={styles.fieldLabel}>نوع الهدف</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowGoalTypeModal(true)}
          >
            <Text style={[
              styles.dropdownText,
              !newGoal.type && styles.placeholderText
            ]}>
              {getSelectedGoalType()}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* اسم الهدف - يظهر فقط عند اختيار "أخرى" أو عندما لا يتم اختيار نوع */}
          {(!newGoal.type || newGoal.type === 'other') && (
            <>
              <Text style={styles.fieldLabel}>اسم الهدف</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: شراء سيارة تويوتا كامري"
                value={newGoal.name}
                onChangeText={(text) => setNewGoal({...newGoal, name: text})}
                textAlign="right"
              />
            </>
          )}

          {/* تكلفة الهدف */}
          <Text style={styles.fieldLabel}>تكلفة الهدف (ريال)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="التكلفة الإجمالية"
            value={newGoal.totalCost}
            onChangeText={(text) => setNewGoal({...newGoal, totalCost: text})}
            keyboardType="numeric"
            textAlign="right"
          />

          {/* تاريخ تحقيق الهدف */}
          <Text style={styles.fieldLabel}>تاريخ تحقيق الهدف</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity 
              style={styles.dateDropdown}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{newGoal.targetDate.day}</Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateDropdown}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{newGoal.targetDate.month}</Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateDropdown}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{newGoal.targetDate.year}</Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* المبلغ المتوفر حالياً */}
          <Text style={styles.fieldLabel}>المبلغ المتوفر حالياً (ريال)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="المبلغ المتوفر حالياً"
            value={newGoal.currentAmount}
            onChangeText={(text) => setNewGoal({...newGoal, currentAmount: text})}
            keyboardType="numeric"
            textAlign="right"
          />

          {/* المبلغ الشهري المخطط توفيره */}
          <Text style={styles.fieldLabel}>المبلغ الشهري المخطط توفيره (ريال)</Text>
          <TextInput
            style={{...styles.textInput,marginBottom:40}}
            placeholder="المبلغ الشهري"
            value={newGoal.monthlyAmount}
            onChangeText={(text) => setNewGoal({...newGoal, monthlyAmount: text})}
            keyboardType="numeric"
            textAlign="right"
          />
        </ScrollView>

        {/* زر تمت */}
        <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
          <Text style={styles.saveButtonText}>تمت</Text>
        </TouchableOpacity>

        {/* Modal لنوع الهدف */}
        <Modal
          visible={showGoalTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGoalTypeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>اختر نوع الهدف</Text>
              {goalTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.modalOption}
                  onPress={() => {
                    // إذا كان النوع المختار ليس "أخرى"، استخدم اسم النوع كاسم الهدف
                    const goalName = type.id === 'other' ? '' : type.name;
                    setNewGoal({
                      ...newGoal, 
                      type: type.id,
                      name: goalName
                    });
                    setShowGoalTypeModal(false);
                  }}
                >
                  <View style={styles.modalOptionContent}>
                    <View style={styles.modalOptionIcon}>{type.icon}</View>
                    <Text style={styles.modalOptionText}>{type.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* منتقي تاريخ موحد */}
        <DatePickerModal
          visible={showDatePicker}
          mode="date"
          title="اختر التاريخ"
          initialDate={new Date(newGoal.targetDate.year, months.indexOf(newGoal.targetDate.month), newGoal.targetDate.day)}
          minimumDate={new Date()}
          onConfirm={(selected) => {
            const day = selected.getDate();
            const month = months[selected.getMonth()];
            const year = selected.getFullYear();
            setNewGoal({
              ...newGoal,
              targetDate: { day, month, year },
            });
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      </SafeAreaView>
    );
  }

  // Edit Modal
  if (showEditForm && editingGoal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowEditForm(false);
              setEditingGoal(null);
              setEditMonthlyAmount('');
            }}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تعديل المبلغ الشهري</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.editGoalInfo}>
            <Text style={styles.editGoalName}>{editingGoal.name}</Text>
            <Text style={styles.editGoalAmount}>
              {editingGoal.currentAmount.toLocaleString()} من {editingGoal.totalCost.toLocaleString()} ريال
            </Text>
          </View>

          <Text style={styles.fieldLabel}>المبلغ الشهري الجديد (ريال)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="أدخل المبلغ الشهري الجديد"
            value={editMonthlyAmount}
            onChangeText={setEditMonthlyAmount}
            keyboardType="numeric"
            textAlign="right"
          />

          {parseFloat(editMonthlyAmount) > 0 && (
            <View style={styles.calculationInfo}>
              <Text style={styles.calculationText}>
                المبلغ المتبقي: {(editingGoal.totalCost - editingGoal.currentAmount).toLocaleString()} ريال
              </Text>
              <Text style={styles.calculationText}>
                عدد الأشهر المطلوبة: {calculateMonthsToGoal({...editingGoal, monthlyAmount: parseFloat(editMonthlyAmount)})} شهر
              </Text>
                             <Text style={styles.calculationText}>
                 الوقت المطلوب: {formatTimeToGoal(calculateMonthsToGoal({...editingGoal, monthlyAmount: parseFloat(editMonthlyAmount)}))}
               </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
          <Text style={styles.saveButtonText}>حفظ التعديل</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainHeader}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.title}>الأهداف الكبيرة</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Trophy size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>لا توجد أهداف كبيرة</Text>
            <Text style={styles.emptySubtitle}>
              ابدأ بإضافة أهدافك الكبيرة والتخطيط لتحقيقها
            </Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => setShowAddForm(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyAddButtonText}>إضافة هدف</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => {
              const progress = goal.totalCost > 0 ? (goal.currentAmount / goal.totalCost) * 100 : 0;
              const selectedType = goalTypes.find(type => type.id === goal.type);
              const yearsRemaining = calculateYearsRemaining(goal);
              const monthsToGoal = calculateMonthsToGoal(goal);
              
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalIcon}>{selectedType?.icon}</View>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalType}>{selectedType?.name}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openEditModal(goal)}
                    >
                      <Edit size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.goalProgress}>{progress.toFixed(0)}%</Text>
                  </View>

                  <View style={styles.goalAmounts}>
                    <Text style={styles.currentAmount}>
                      {goal.currentAmount.toLocaleString()} رس
                    </Text>
                    <Text style={styles.totalAmount}>
                      من {goal.totalCost.toLocaleString()} رس
                    </Text>
                  </View>

                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${progress}%` }]} 
                    />
                  </View>

                  <View style={styles.goalFooter}>
                    <View style={styles.goalFooterLeft}>
                      <Text style={styles.targetDate}>
                        الهدف: {goal.targetDate.day} {goal.targetDate.month} {goal.targetDate.year}
                      </Text>
                      <View style={styles.adjustActions}>
                        <TouchableOpacity style={styles.adjustButton} onPress={() => openAdjustModal(goal)}>
                          <DollarSign size={16} color="#6B7280" />
                          <Text style={styles.adjustButtonText}>تحديث الرصيد</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.goalFooterRight}>
                      <Text style={styles.monthlyAmount}>
                        شهرياً: {goal.monthlyAmount.toLocaleString()} رس
                      </Text>
                      {goal.monthlyAmount > 0 && monthsToGoal !== Infinity && (
                        <>
                          <Text style={styles.monthsToGoal}>
                            الوقت المتوقع: {formatTimeToGoal(monthsToGoal)}
                          </Text>
                          <Text style={styles.monthsToGoalSecondary}>
                            أي ما يعادل {monthsToGoal} شهر
                          </Text>
                        </>
                      )}
                      {goal.monthlyAmount > 0 && monthsToGoal === Infinity && (
                        <Text style={styles.monthsToGoal}>
                          لا يمكن الوصول بالمدخرات الحالية
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Adjust Amount Modal */}
      <Modal
        visible={showAdjustForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAdjustForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تحديث رصيد الهدف</Text>
            {goalToAdjust && (
              <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.adjustGoalName}>{goalToAdjust.name}</Text>
                <Text style={styles.adjustCurrentInfo}>
                  الحالي: {goalToAdjust.currentAmount.toLocaleString()} رس من {goalToAdjust.totalCost.toLocaleString()} رس
                </Text>
                <Text style={styles.fieldLabel}>المبلغ</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل المبلغ"
                  value={adjustAmount}
                  onChangeText={setAdjustAmount}
                  keyboardType="numeric"
                  textAlign="right"
                />
                <View style={styles.adjustButtonsRow}>
                  <TouchableOpacity style={styles.adjustAddButton} onPress={() => applyAdjustment('add')}>
                    <Plus size={18} color="#FFFFFF" />
                    <Text style={styles.adjustActionText}>إضافة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adjustSubtractButton} onPress={() => applyAdjustment('subtract')}>
                    <Minus size={18} color="#FFFFFF" />
                    <Text style={styles.adjustActionText}>خصم</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowAdjustForm(false)}>
                  <Text style={styles.modalCloseButtonText}>إغلاق</Text>
                </TouchableOpacity>
              </View>
            )}
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
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  mainHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#095028',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  editGoalInfo: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  editGoalName: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  editGoalAmount: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  calculationInfo: {
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  calculationText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#0C4A6E',
    textAlign: 'right',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'right',
  },
  dropdownButton: {
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'right',
  },
  dateContainer: {
   flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 8,
  },
  dateDropdown: {
    flex: 1,
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#095028',
    margin: 20,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '60%',
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionContent: {
   flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  modalOptionIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAddButton: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyAddButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    // flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 2,
  },
  goalType: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  goalProgress: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  goalAmounts: {
  flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
     flexDirection: 'row-reverse',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#095028',
    borderRadius: 4,
    
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  goalFooterLeft: {
    flex: 1,
  },
  goalFooterRight: {
    alignItems: 'flex-end',
  },
  targetDate: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 4,
  },
  yearsRemaining: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#DC2626',
    textAlign: 'right',
  },
  monthlyAmount: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#095028',
    textAlign: 'right',
    marginBottom: 4,
  },
  monthsToGoal: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  monthsToGoalSecondary: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  adjustActions: {
    marginTop: 8,
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adjustButtonText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  adjustButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  adjustAddButton: {
    flex: 1,
 flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  adjustSubtractButton: {
    flex: 1,
 flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
  },
  adjustActionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
  adjustGoalName: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  adjustCurrentInfo: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 8,
  },
  modalCloseButton: {
    marginTop: 12,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
});