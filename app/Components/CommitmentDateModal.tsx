import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  I18nManager
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { X, Calendar, Clock, Repeat, CalendarDays } from 'lucide-react-native';

interface CommitmentDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSetDate: (date: Date, type: 'monthly' | 'yearly') => void;
  currentDate?: Date | null;
  currentType?: 'monthly' | 'yearly';
}

export function CommitmentDateModal({ 
  visible, 
  onClose, 
  onSetDate, 
  currentDate,
  currentType = 'monthly'
}: CommitmentDateModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    currentDate || new Date()
  );
  const [selectedType, setSelectedType] = useState<'monthly' | 'yearly'>(currentType);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (time: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    setSelectedDate(newDate);
    setTimePickerVisible(false);
  };

  const handleSaveDate = () => {
    onSetDate(selectedDate, selectedType);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNextMonthDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const getNextYearDate = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear;
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>تاريخ الالتزام</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Type Selection */}
              <View style={styles.typeSelector}>
                <Text style={styles.sectionTitle}>نوع الالتزام</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.typeButton,
                      selectedType === 'monthly' && styles.activeTypeButton
                    ]}
                    onPress={() => setSelectedType('monthly')}
                  >
                    <Repeat size={20} color={selectedType === 'monthly' ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.typeButtonText,
                      selectedType === 'monthly' && styles.activeTypeButtonText
                    ]}>
                      شهري
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.typeButton,
                      selectedType === 'yearly' && styles.activeTypeButton
                    ]}
                    onPress={() => setSelectedType('yearly')}
                  >
                    <CalendarDays size={20} color={selectedType === 'yearly' ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.typeButtonText,
                      selectedType === 'yearly' && styles.activeTypeButtonText
                    ]}>
                      سنوي
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Selection */}
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setDatePickerVisible(true)}
              >
                <Calendar size={20} color="#12A150" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.dateTimeLabel}>التاريخ</Text>
                  <Text style={styles.dateTimeValue}>
                    {formatDate(selectedDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Time Selection */}
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setTimePickerVisible(true)}
              >
                <Clock size={20} color="#12A150" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.dateTimeLabel}>الوقت</Text>
                  <Text style={styles.dateTimeValue}>
                    {formatTime(selectedDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Quick Options */}
              <View style={styles.quickOptions}>
                <Text style={styles.quickOptionsTitle}>خيارات سريعة</Text>
                <View style={styles.quickOptionsGrid}>
                  <TouchableOpacity 
                    style={styles.quickOption}
                    onPress={() => {
                      const today = new Date();
                      today.setHours(9, 0, 0, 0); // 9 AM
                      setSelectedDate(today);
                    }}
                  >
                    <Text style={styles.quickOptionText}>اليوم 9 صباحاً</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.quickOption}
                    onPress={() => {
                      const nextMonth = getNextMonthDate();
                      nextMonth.setHours(9, 0, 0, 0);
                      setSelectedDate(nextMonth);
                    }}
                  >
                    <Text style={styles.quickOptionText}>الشهر القادم</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.quickOption}
                    onPress={() => {
                      const nextYear = getNextYearDate();
                      nextYear.setHours(9, 0, 0, 0);
                      setSelectedDate(nextYear);
                    }}
                  >
                    <Text style={styles.quickOptionText}>السنة القادمة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.quickOption}
                    onPress={() => {
                      const endOfMonth = new Date();
                      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0); // Last day of next month
                      endOfMonth.setHours(9, 0, 0, 0);
                      setSelectedDate(endOfMonth);
                    }}
                  >
                    <Text style={styles.quickOptionText}>آخر الشهر</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveDate}
              >
                <Text style={styles.saveButtonText}>حفظ التاريخ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        date={selectedDate}
        minimumDate={new Date()}
        locale="ar"
      />

      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
        date={selectedDate}
        locale="ar"
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  typeSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    justifyContent: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#12A150',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  dateTimeButton: {
    flexDirection: "row-reverse",
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    width: '100%',  
    justifyContent: 'space-between',
  },
  dateTimeText: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'right',
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'right',
    marginTop: 2,
  },
  quickOptions: {
    marginTop: 20,
  },
  quickOptionsTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  quickOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickOptionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
    color: '#15803D',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#12A150',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#ffffff',
  },
});
