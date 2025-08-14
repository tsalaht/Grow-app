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
import { X, Calendar, Clock } from 'lucide-react-native';



interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSetReminder: (date: Date) => void;
  currentReminder?: Date | null;
}

export function ReminderModal({ 
  visible, 
  onClose, 
  onSetReminder, 
  currentReminder 
}: ReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    currentReminder || new Date()
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

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

  const handleSaveReminder = () => {
    onSetReminder(selectedDate);
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
              <Text style={styles.headerTitle}>تعيين تذكير</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Date Selection */}
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setDatePickerVisible(true)}
              >
                <Calendar size={20} color="#22C55E"  />
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
                <Clock size={20} color="#22C55E" />
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
                <View style={styles.quickOptionsRow}>
          <TouchableOpacity 
  style={styles.quickOption}
  onPress={() => {
    const afterOneHour = new Date();
    afterOneHour.setHours(afterOneHour.getHours() + 1);
    setSelectedDate(afterOneHour);
  }}
>
  <Text style={styles.quickOptionText}>بعد ساعة</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={styles.quickOption}
  onPress={() => {
    const afterTwoHours = new Date();
    afterTwoHours.setHours(afterTwoHours.getHours() + 2);
    setSelectedDate(afterTwoHours);
  }}
>
  <Text style={styles.quickOptionText}>بعد ساعتين</Text>
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
                onPress={handleSaveReminder}
              >
                <Text style={styles.saveButtonText}>حفظ التذكير</Text>
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
      />

      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
        date={selectedDate}
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
    maxHeight: '70%',
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
    // flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
    textAlign: 'left',
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'left',
    marginTop: 2,
  },
  quickOptions: {
    marginTop: 20,
  },
  quickOptionsTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'left',
    marginBottom: 12,
  },
  quickOptionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickOption: {
    flex: 1,
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
    backgroundColor: '#22C55E',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#ffffff',
  },
});