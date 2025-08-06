import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  I18nManager,
  Alert,
  Modal,
} from 'react-native';
import { Trophy, Plus, Target, Calendar, DollarSign, ChevronDown, X } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

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
  { id: 'marriage', name: 'الزواج', emoji: '💍' },
  { id: 'car', name: 'شراء سيارة', emoji: '🚗' },
  { id: 'house', name: 'شراء منزل', emoji: '🏠' },
  { id: 'business', name: 'بدء مشروع', emoji: '💼' },
  { id: 'education', name: 'التعليم', emoji: '🎓' },
  { id: 'other', name: 'أخرى', emoji: '🎯' },
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
  const [showGoalTypeModal, setShowGoalTypeModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
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

  const getSelectedGoalType = () => {
    const selected = goalTypes.find(type => type.id === newGoal.type);
    return selected ? `${selected.emoji} ${selected.name}` : 'اختر نوع الهدف';
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

          {/* اسم الهدف */}
          <Text style={styles.fieldLabel}>اسم الهدف</Text>
          <TextInput
            style={styles.textInput}
            placeholder="مثال: شراء سيارة تويوتا كامري"
            value={newGoal.name}
            onChangeText={(text) => setNewGoal({...newGoal, name: text})}
            textAlign="right"
          />

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
              onPress={() => setShowDayModal(true)}
            >
              <Text style={styles.dateText}>{newGoal.targetDate.day}</Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateDropdown}
              onPress={() => setShowMonthModal(true)}
            >
              <Text style={styles.dateText}>{newGoal.targetDate.month}</Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateDropdown}
              onPress={() => setShowYearModal(true)}
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
            style={styles.textInput}
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
                    setNewGoal({...newGoal, type: type.id});
                    setShowGoalTypeModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {type.emoji} {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal لليوم */}
        <Modal
          visible={showDayModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDayModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>اختر اليوم</Text>
              <ScrollView style={styles.modalScroll}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={styles.modalOption}
                    onPress={() => {
                      setNewGoal({
                        ...newGoal, 
                        targetDate: {...newGoal.targetDate, day}
                      });
                      setShowDayModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal للشهر */}
        <Modal
          visible={showMonthModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowMonthModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>اختر الشهر</Text>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.modalOption}
                  onPress={() => {
                    setNewGoal({
                      ...newGoal, 
                      targetDate: {...newGoal.targetDate, month}
                    });
                    setShowMonthModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal للسنة */}
        <Modal
          visible={showYearModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowYearModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>اختر السنة</Text>
              <ScrollView style={styles.modalScroll}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={styles.modalOption}
                    onPress={() => {
                      setNewGoal({
                        ...newGoal, 
                        targetDate: {...newGoal.targetDate, year}
                      });
                      setShowYearModal(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
              
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalEmoji}>{selectedType?.emoji}</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalType}>{selectedType?.name}</Text>
                    </View>
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
                    <Text style={styles.targetDate}>
                      الهدف: {goal.targetDate.day} {goal.targetDate.month} {goal.targetDate.year}
                    </Text>
                    <Text style={styles.monthlyAmount}>
                      شهرياً: {goal.monthlyAmount.toLocaleString()} رس
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    flexDirection: 'row',
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
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'right',
  },
  dropdownButton: {
    flexDirection: 'row',
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
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  dateDropdown: {
    flex: 1,
    flexDirection: 'row',
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
    justifyContent: 'flex-end',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
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
  goalProgress: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
  },
  goalAmounts: {
    flexDirection: 'row',
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#095028',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetDate: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  monthlyAmount: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#095028',
  },
});