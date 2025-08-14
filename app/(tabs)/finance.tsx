import React, { useState, useEffect } from 'react';
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
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar, ChartBar as BarChart3, Calculator, FileText, CreditCard, Save, X, CreditCard as Edit3, Trash2, Utensils, Plane, PartyPopper, ShoppingBag, BookOpen, Heart, Receipt, Tag } from 'lucide-react-native';
import { Chrome as Home, Car, CalendarDays } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';



interface MonthlyData {
  year: number;
  month: string;
  monthNumber: number;
  income: number;
  expenses: Expense[];
  commitments: Commitment[];
  remaining: number;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
}

interface Commitment {
  id: string;
  name: string;
  amount: number;
  type: 'monthly' | 'yearly';
  date: Date;
}

type TabType = 'overview' | 'expenses' | 'commitments' | 'calculator' | 'reports';

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [notificationService] = useState(() => NotificationService.getInstance());
  
  // New expense form
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'عام'
  });

  // Expense categories with professional icons
  const expenseCategories = [
    { id: 'food_drink', name: 'طعام وشراب', icon: Utensils },
    { id: 'travel', name: 'سفر', icon: Plane },
    { id: 'enjoy', name: 'ترفيه', icon: PartyPopper },
    { id: 'shop', name: 'تسوق', icon: ShoppingBag },
    { id: 'learn', name: 'تعلم', icon: BookOpen },
    { id: 'health', name: 'صحة', icon: Heart },
    { id: 'bills', name: 'فواتير', icon: Receipt },
    { id: 'others', name: 'أخرى', icon: Tag },
  ];

  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('');
  const [showExpenseDropdown, setShowExpenseDropdown] = useState(false);
  const [customExpenseCategory, setCustomExpenseCategory] = useState('');

  // New commitment form
  const [newCommitment, setNewCommitment] = useState({
    name: '',
    amount: '',
    type: 'monthly' as 'monthly' | 'yearly',
    date: '',
    notes: ''
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    {
      year: 2025,
      month: 'يناير',
      monthNumber: 1,
      income: 8000,
      expenses: [
        { id: '1', name: 'تسوق البقالة', amount: 800, category: 'طعام', date: new Date() },
        { id: '2', name: 'وقود السيارة', amount: 400, category: 'مواصلات', date: new Date() }
      ],
      commitments: [
        { id: '1', name: 'إيجار المنزل', amount: 2000, type: 'monthly', date: new Date() },
        { id: '2', name: 'قسط السيارة', amount: 800, type: 'monthly', date: new Date() }
      ],
      remaining: 4000
    }
  ]);

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('ar-SA', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const getCurrentMonthData = () => {
    return monthlyData.find(data => 
      data.year === currentYear && 
      data.monthNumber === currentDate.getMonth() + 1
    ) || {
      year: currentYear,
      month: currentMonth,
      monthNumber: currentDate.getMonth() + 1,
      income: 0,
      expenses: [],
      commitments: [],
      remaining: 0
    };
  };

  const currentMonthData = getCurrentMonthData();

  const saveMonthlyIncome = async () => {
    const income = parseFloat(monthlyIncome);
    if (isNaN(income) || income <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    const updatedData = monthlyData.map(data => {
      if (data.year === currentYear && data.monthNumber === currentDate.getMonth() + 1) {
        const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalCommitments = data.commitments.reduce((sum, com) => sum + com.amount, 0);
        return {
          ...data,
          income,
          remaining: income - totalExpenses - totalCommitments
        };
      }
      return data;
    });

    const existingMonth = monthlyData.find(data => 
      data.year === currentYear && data.monthNumber === currentDate.getMonth() + 1
    );

    if (!existingMonth) {
      updatedData.push({
        year: currentYear,
        month: currentMonth,
        monthNumber: currentDate.getMonth() + 1,
        income,
        expenses: [],
        commitments: [],
        remaining: income
      });
    }

    setMonthlyData(updatedData);
    setMonthlyIncome('');
    setShowIncomeModal(false);
    
    // جدولة إشعار تذكير الراتب للشهر القادم
    try {
      await notificationService.scheduleMonthlyIncomeReminder();
    } catch (error) {
      console.error('خطأ في جدولة إشعار الراتب:', error);
    }
    
    Alert.alert('تم الحفظ', 'تم حفظ الدخل الشهري بنجاح');
  };

  const addExpense = async () => {
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!selectedExpenseCategory) {
      Alert.alert('خطأ', 'يرجى اختيار التصنيف');
      return;
    }

    const selectedCategory = expenseCategories.find(cat => cat.id === selectedExpenseCategory);
    const categoryName = selectedCategory?.name || 'عام';
    
    const expenseName = selectedExpenseCategory === 'others' 
      ? customExpenseCategory.trim() 
      : `${categoryName} - ${new Date().toLocaleDateString('ar-SA')}`;

    const expense: Expense = {
      id: Date.now().toString(),
      name: expenseName,
      amount,
      category: categoryName,
      date: new Date()
    };

    const existingMonthIndex = monthlyData.findIndex(data => 
      data.year === currentYear && data.monthNumber === currentDate.getMonth() + 1
    );

    let updatedData = [...monthlyData];
    
    if (existingMonthIndex !== -1) {
      // Update existing month
      const existingMonth = updatedData[existingMonthIndex];
      const newExpenses = [...existingMonth.expenses, expense];
      const totalExpenses = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalCommitments = existingMonth.commitments.reduce((sum, com) => sum + com.amount, 0);
      
      updatedData[existingMonthIndex] = {
        ...existingMonth,
        expenses: newExpenses,
        remaining: existingMonth.income - totalExpenses - totalCommitments
      };
    } else {
      // Create new month data
      const newMonthData: MonthlyData = {
        year: currentYear,
        month: currentMonth,
        monthNumber: currentDate.getMonth() + 1,
        income: 0,
        expenses: [expense],
        commitments: [],
        remaining: -expense.amount
      };
      updatedData.push(newMonthData);
    }

    setMonthlyData(updatedData);
    setNewExpense({ name: '', amount: '', category: 'عام' });
    setSelectedExpenseCategory('');
    setCustomExpenseCategory('');
    setShowExpenseDropdown(false);
    setShowExpenseModal(false);
    
    // فحص تحذير المصروفات
    const currentData = updatedData.find(data => 
      data.year === currentYear && data.monthNumber === currentDate.getMonth() + 1
    );
    const totalExpenses = currentData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const monthlyIncomeAmount = currentData?.income || 0;
    
    if (monthlyIncomeAmount > 0) {
      try {
        await notificationService.scheduleExpenseWarning(totalExpenses, monthlyIncomeAmount);
      } catch (error) {
        console.error('خطأ في فحص تحذير المصروفات:', error);
      }
    }
    
    Alert.alert('تم الإضافة', 'تم إضافة المصروف بنجاح');
  };

  const commitmentCategories = [
    { id: 'rent', name: 'إيجار', icon: '🏠' },
    { id: 'car_payment', name: 'قسط سيارة', icon: '🚗' },
    { id: 'house_payment', name: 'قسط منزل', icon: '🏡' },
    { id: 'invitation', name: 'عزومة', icon: '🍽️' },
    { id: 'monthly_fixed', name: 'التزام شهري ثابت', icon: '🗓️' },
    { id: 'other', name: 'أخرى', icon: '' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const addCommitment = async () => {
    const amount = parseFloat(newCommitment.amount || '0');
    if (!selectedCategory || isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال بيانات صحيحة');
      return;
    }

    const commitment: Commitment = {
      id: Date.now().toString(),
      name: commitmentCategories.find(cat => cat.id === selectedCategory)?.name || 'التزام',
      amount,
      type: newCommitment.type,
      date: new Date()
    };

    const updatedData = monthlyData.map(data => {
      if (data.year === currentYear && data.monthNumber === currentDate.getMonth() + 1) {
        const newCommitments = [...data.commitments, commitment];
        const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalCommitments = newCommitments.reduce((sum, com) => sum + com.amount, 0);
        return {
          ...data,
          commitments: newCommitments,
          remaining: data.income - totalExpenses - totalCommitments
        };
      }
      return data;
    });

    setMonthlyData(updatedData);
    setNewCommitment({ name: '', amount: '', type: 'monthly', date: '', notes: '' });
    setSelectedCategory('');
    setShowDropdown(false);
    setShowCommitmentModal(false);
    
    // جدولة إشعار تذكير الالتزام
    try {
      const commitmentData = {
        id: commitment.id,
        name: commitment.name,
        amount: commitment.amount,
        dueDate: new Date(), // يجب تحديد التاريخ الفعلي
        recurring: commitment.type === 'monthly',
      };
      await notificationService.scheduleCommitmentReminder(commitmentData);
    } catch (error) {
      console.error('خطأ في جدولة إشعار الالتزام:', error);
    }
    
    Alert.alert('تم الإضافة', 'تم إضافة الالتزام بنجاح');
  };

  const tabs = [
    { id: 'overview', title: 'نظرة عامة', icon: BarChart3 },
    { id: 'expenses', title: 'المصروفات', icon: CreditCard },
    { id: 'commitments', title: 'الالتزامات', icon: Calendar },
    { id: 'calculator', title: 'حاسبة الأقساط', icon: Calculator },
    { id: 'reports', title: 'التقارير', icon: FileText },
  ];

  if (!fontsLoaded) {
    return null;
  }

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Income Input Section */}
      <View style={styles.incomeSection}>
        <TouchableOpacity 
          style={styles.incomeCard}
          onPress={() => setShowIncomeModal(true)}
        >
          <View style={styles.incomeHeader}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.incomeTitle}>الدخل الشهري لـ {currentMonth}</Text>
          </View>
          <Text style={styles.incomeAmount}>
            {currentMonthData.income.toLocaleString()} رس
          </Text>
          <Text style={styles.incomeSubtext}>اضغط لتحديث الدخل</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.summaryNumber}>{currentMonthData.income.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>الدخل الشهري</Text>
        </View>
        <View style={styles.summaryCard}>
          <TrendingDown size={20} color="#EF4444" />
          <Text style={styles.summaryNumber}>
            {currentMonthData.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>المصروفات</Text>
        </View>
        <View style={styles.summaryCard}>
          <Calendar size={20} color="#F59E0B" />
          <Text style={styles.summaryNumber}>
            {currentMonthData.commitments.reduce((sum, com) => sum + com.amount, 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>الالتزامات</Text>
        </View>
        <View style={styles.summaryCard}>
          <DollarSign size={20} color="#3B82F6" />
          <Text style={styles.summaryNumber}>{currentMonthData.remaining.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>المتبقي</Text>
        </View>
      </View>

      {/* Monthly Table */}
      <View style={styles.tableSection}>
        <Text style={styles.tableTitle}>ملخص آخر 6 أشهر</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>الشهر</Text>
            <Text style={styles.tableHeaderText}>الدخل</Text>
            <Text style={styles.tableHeaderText}>المصروفات</Text>
            <Text style={styles.tableHeaderText}>الالتزامات</Text>
            <Text style={styles.tableHeaderText}>المتبقي</Text>
          </View>
          {monthlyData.slice(-6).map((data, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellText}>{data.month} {data.year}</Text>
              <Text style={styles.tableCellText}>{data.income.toLocaleString()}</Text>
              <Text style={styles.tableCellText}>
                {data.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
              </Text>
              <Text style={styles.tableCellText}>
                {data.commitments.reduce((sum, com) => sum + com.amount, 0).toLocaleString()}
              </Text>
              <Text style={[
                styles.tableCellText,
                { color: data.remaining >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {data.remaining.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowExpenseModal(true)}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>إضافة مصروف جديد</Text>
      </TouchableOpacity>

      <View style={styles.expensesList}>
        {currentMonthData.expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseName}>{expense.name}</Text>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
            </View>
            <Text style={styles.expenseAmount}>{expense.amount.toLocaleString()} رس</Text>
          </View>
        ))}
        {currentMonthData.expenses.length === 0 && (
          <View style={styles.emptyState}>
            <CreditCard size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>لا توجد مصروفات</Text>
            <Text style={styles.emptySubtitle}>ابدأ بإضافة مصروفاتك الشهرية</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCommitmentsTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowCommitmentModal(true)}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>إضافة التزام جديد</Text>
      </TouchableOpacity>

      <View style={styles.commitmentsList}>
        {currentMonthData.commitments.map((commitment) => (
          <View key={commitment.id} style={styles.commitmentCard}>
            <View style={styles.commitmentInfo}>
              <Text style={styles.commitmentName}>{commitment.name}</Text>
              <Text style={styles.commitmentType}>
                {commitment.type === 'monthly' ? 'شهري' : 'سنوي'}
              </Text>
            </View>
            <Text style={styles.commitmentAmount}>{commitment.amount.toLocaleString()} رس</Text>
          </View>
        ))}
        {currentMonthData.commitments.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>لا توجد التزامات</Text>
            <Text style={styles.emptySubtitle}>ابدأ بإضافة التزاماتك الشهرية</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCalculatorTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.calculatorCard}>
        <Calculator size={48} color="#3B82F6" />
        <Text style={styles.calculatorTitle}>حاسبة الأقساط</Text>
        <Text style={styles.calculatorSubtitle}>قريباً - حاسبة متقدمة لحساب الأقساط والفوائد</Text>
      </View>
    </View>
  );

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reportsCard}>
        <FileText size={48} color="#8B5CF6" />
        <Text style={styles.reportsTitle}>التقارير المالية</Text>
        <Text style={styles.reportsSubtitle}>قريباً - تقارير مفصلة وتحليلات مالية ذكية</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التخطيط المالي الذكي</Text>
        <View style={styles.headerIcons}>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <DollarSign size={60} color="#FFFFFF" style={styles.heroIcon} />
          <Text style={styles.heroTitle}>إدارة المهام والإنجازات</Text>
          <Text style={styles.heroSubtitle}>تتبع تقدمك المالي واحصل على رؤى ذكية</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsList}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.activeTab
                  ]}
                  onPress={() => setActiveTab(tab.id as TabType)}
                >
                  <IconComponent 
                    size={16} 
                    color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText
                  ]}>
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'expenses' && renderExpensesTab()}
        {activeTab === 'commitments' && renderCommitmentsTab()}
        {activeTab === 'calculator' && renderCalculatorTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </ScrollView>

      {/* Income Modal */}
      <Modal
        visible={showIncomeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIncomeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تحديث الدخل الشهري</Text>
              <TouchableOpacity onPress={() => setShowIncomeModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="أدخل الدخل الشهري لهذا الشهر..."
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              keyboardType="numeric"
              textAlign="right"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveMonthlyIncome}>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>حفظ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Expense Modal */}
      <Modal
        visible={showExpenseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExpenseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة مصروف جديد</Text>
              <TouchableOpacity onPress={() => setShowExpenseModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="المبلغ..."
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              keyboardType="numeric"
              textAlign="right"
            />
            <Text style={styles.sectionLabel}>التصنيف</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowExpenseDropdown(!showExpenseDropdown)}
            >
              <View style={styles.dropdownButtonContent}>
                {selectedExpenseCategory ? (
                  <>
                    {(() => {
                      const IconComponent = expenseCategories.find(cat => cat.id === selectedExpenseCategory)?.icon;
                      return IconComponent ? <IconComponent size={20} color="#374151" /> : null;
                    })()}
                    <Text style={styles.dropdownText}>
                      {expenseCategories.find(cat => cat.id === selectedExpenseCategory)?.name}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.dropdownText}>اختر التصنيف</Text>
                )}
              </View>
              <Text style={styles.dropdownArrow}>{showExpenseDropdown ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showExpenseDropdown && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {expenseCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedExpenseCategory(category.id);
                        setShowExpenseDropdown(false);
                      }}
                    >
                      <IconComponent size={20} color="#374151" />
                      <Text style={styles.dropdownItemText}>{category.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {selectedExpenseCategory === 'others' && (
              <TextInput
                style={styles.modalInput}
                placeholder="اكتب اسم المصروف..."
                value={customExpenseCategory}
                onChangeText={setCustomExpenseCategory}
                textAlign="right"
              />
            )}
            <TouchableOpacity style={styles.saveButton} onPress={addExpense}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>إضافة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Commitment Modal */}
      <Modal
        visible={showCommitmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCommitmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة التزام جديد</Text>
              <TouchableOpacity onPress={() => setShowCommitmentModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>اسم الالتزام</Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {selectedCategory ? 
                    `${commitmentCategories.find(cat => cat.id === selectedCategory)?.icon} ${commitmentCategories.find(cat => cat.id === selectedCategory)?.name}` : 
                    'اختر نوع الالتزام'
                  }
                </Text>
                <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              
              {showDropdown && (
                <View style={styles.dropdownList}>
                  {commitmentCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCategory(category.id);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {category.icon} {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            
              <Text style={styles.fieldLabel}>تاريخ الالتزام الشهري</Text>
              <TextInput
                style={styles.formInput}
                placeholder="25 أبريل 2524"
                value={newCommitment.date}
                onChangeText={(text) => setNewCommitment({...newCommitment, date: text})}
                textAlign="right"
              />
              
              <Text style={styles.fieldLabel}>القيمة</Text>
              <TextInput
                style={styles.formInput}
                placeholder="أدخل المبلغ"
                value={newCommitment.amount}
                onChangeText={(text) => setNewCommitment({...newCommitment, amount: text})}
                keyboardType="numeric"
                textAlign="right"
              />
              
              <Text style={styles.fieldLabel}>ملاحظات إضافية (اختياري)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="أضف ملاحظات إضافية..."
                value={newCommitment.notes}
                onChangeText={(text) => setNewCommitment({...newCommitment, notes: text})}
                multiline
                numberOfLines={4}
                textAlign="right"
                textAlignVertical="top"
              />
            </ScrollView>
            
            <TouchableOpacity style={styles.fullWidthSaveButton} onPress={addCommitment}>
              <Text style={styles.fullWidthSaveButtonText}>حفظ</Text>
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
   flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  headerIcons: {
  flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  notificationBadge: {
    backgroundColor: '#095028',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
  },
  heroCard: {
    backgroundColor: '#095028',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    marginBottom: 12,
    opacity: 0.3,
    position: 'absolute',
    left: 20,
    top: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsList: {
  flexDirection: 'row-reverse',
    gap: 8,
  },
  tab: {
   flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeTab: {
    backgroundColor: '#095028',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingBottom: 20,
  },
  incomeSection: {
    marginBottom: 20,
  },
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  incomeHeader: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  incomeTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
  },
  incomeAmount: {
    fontSize: 24,
    fontFamily: 'Tajawal_700Bold',
    color: '#095028',
    textAlign: 'center',
    marginBottom: 8,
  },
  incomeSubtext: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryContainer: {
   flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryNumber: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  tableSection: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'right',
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tableHeader: {
 flexDirection: 'row-reverse',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
 flexDirection: 'row-reverse',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCellText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
   flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  expensesList: {
    gap: 12,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'right',
  },
  expenseCategory: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  expenseAmount: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#EF4444',
  },
  commitmentsList: {
    gap: 12,
  },
  commitmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  commitmentInfo: {
    flex: 1,
  },
  commitmentName: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 2,
    textAlign: 'right',
  },
  commitmentType: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  commitmentAmount: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  calculatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calculatorTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  calculatorSubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  reportsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportsTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  reportsSubtitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'center',
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
   flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#374151',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 16,
  },
  saveButton: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#095028',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#FFFFFF',
  },
  typeSelector: {
 flexDirection: 'row-reverse',
    gap: 12,
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
    backgroundColor: '#10B981',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  commitmentModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'right',
  },
  commitmentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  categoriesGrid: {
    marginBottom: 20,
  },
  categoryOption: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    position: 'relative',
  },
  selectedCategoryOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  checkmark: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Tajawal_700Bold',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  commitmentSaveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  commitmentSaveButtonText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
  fullScreenModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    width: '100%',
    height: '90%',
    maxHeight: '90%',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right',
  },
  dropdownButton: {
 flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  dropdownButtonContent: {
 flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginTop: -15,
    marginBottom: 20,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
  flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    textAlign: 'right',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fullWidthSaveButton: {
    backgroundColor: '#095028',
    margin: 24,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  fullWidthSaveButtonText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
});