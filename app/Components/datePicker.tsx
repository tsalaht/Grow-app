import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X } from 'lucide-react-native';

type PickerMode = 'date' | 'time' | 'datetime';

interface GrowupeDatePickerProps {
  visible: boolean;
  mode: PickerMode;
  initialDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string;
  title?: string;
  onConfirm: (selectedDate: Date) => void;
  onClose: () => void;
}

const getDefaultTitle = (mode: PickerMode): string => {
  switch (mode) {
    case 'time':
      return 'اختر الوقت';
    case 'datetime':
      return 'اختر التاريخ والوقت';
    case 'date':
    default:
      return 'اختر التاريخ';
  }
};

const clampDate = (date: Date, min?: Date, max?: Date): Date => {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
};

export default function DatePickerModal({
  visible,
  mode,
  initialDate,
  minimumDate,
  maximumDate,
  locale = 'ar',
  title,
  onConfirm,
  onClose,
}: GrowupeDatePickerProps) {
  const now = useMemo(() => new Date(), []);
  const safeInitial = useMemo(() => clampDate(initialDate ?? now, minimumDate, maximumDate), [initialDate, minimumDate, maximumDate, now]);

  const [currentDate, setCurrentDate] = useState<Date>(safeInitial);

  useEffect(() => {
    if (visible) {
      setCurrentDate(safeInitial);
    }
  }, [visible, safeInitial]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title ?? getDefaultTitle(mode)}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={currentDate}
              mode={mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'spinner'}
              is24Hour
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={(_, selected) => {
                if (selected) setCurrentDate(selected);
              }}
              locale="ar"
            />
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onConfirm(currentDate)}
          >
            <Text style={styles.confirmButtonText}>تم</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Tajawal_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  pickerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#095028',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
  },
});