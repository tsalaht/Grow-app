import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { 
  X, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Type,
  Minus,
  Plus,
  List,
  ListOrdered,
  Palette
} from 'lucide-react-native';

interface FormatButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress: () => void;
}

const FormatButton = ({ icon, label, isActive, onPress }: FormatButtonProps) => (
  <TouchableOpacity
    style={[
      styles.formatButton,
      isActive && styles.formatButtonActive
    ]}
    onPress={onPress}
  >
    {icon}
    <Text style={[
      styles.formatButtonText,
      isActive && styles.formatButtonTextActive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

interface TextFormattingModalProps {
  visible: boolean;
  onClose: () => void;
  onFormatChange: (format: string) => void;
  currentFontSize: number;
}

export function TextFormattingModal({ 
  visible, 
  onClose, 
  onFormatChange,
  currentFontSize 
}: TextFormattingModalProps) {
  return (
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
            <Text style={styles.headerTitle}>تنسيق النص</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Text Style Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>نمط النص</Text>
              <View style={styles.formatRow}>
                <FormatButton
                  icon={<Bold size={20} color="#374151" />}
                  label="غامق"
                  onPress={() => onFormatChange('bold')}
                />
                <FormatButton
                  icon={<Italic size={20} color="#374151" />}
                  label="مائل"
                  onPress={() => onFormatChange('italic')}
                />
                <FormatButton
                  icon={<Underline size={20} color="#374151" />}
                  label="تحته خط"
                  onPress={() => onFormatChange('underline')}
                />
                <FormatButton
                  icon={<Palette size={20} color="#374151" />}
                  label="نوع الخط"
                  onPress={() => onFormatChange('font-family')}
                />
              </View>
            </View>

            {/* Alignment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>محاذاة النص والقوائم</Text>
              <View style={styles.formatRow}>
                <FormatButton
                  icon={<AlignRight size={20} color="#374151" />}
                  label="يمين"
                  onPress={() => onFormatChange('align-right')}
                />
                <FormatButton
                  icon={<AlignCenter size={20} color="#374151" />}
                  label="وسط"
                  onPress={() => onFormatChange('align-center')}
                />
                <FormatButton
                  icon={<AlignLeft size={20} color="#374151" />}
                  label="يسار"
                  onPress={() => onFormatChange('align-left')}
                />
                <FormatButton
                  icon={<AlignJustify size={20} color="#374151" />}
                  label="ضبط كامل"
                  onPress={() => onFormatChange('align-justify')}
                />
                <FormatButton
                  icon={<List size={20} color="#374151" />}
                  label="قائمة نقطية"
                  onPress={() => onFormatChange('bullet-list')}
                />
                <FormatButton
                  icon={<ListOrdered size={20} color="#374151" />}
                  label="قائمة مرقمة"
                  onPress={() => onFormatChange('numbered-list')}
                />
              </View>
            </View>

            {/* Font Size Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>حجم الخط</Text>
              <View style={styles.fontSizeRow}>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() => onFormatChange('decrease-font')}
                >
                  <Minus size={20} color="#374151" />
                </TouchableOpacity>
                <View style={styles.fontSizeDisplay}>
                  <Type size={20} color="#374151" />
                  <Text style={styles.fontSizeText}>{currentFontSize}</Text>
                </View>
                <TouchableOpacity
                  style={styles.fontSizeButton}
                  onPress={() => onFormatChange('increase-font')}
                >
                  <Plus size={20} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
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
    fontFamily: 'Cairo-Bold',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  formatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minWidth: 90,
  },
  formatButtonActive: {
    backgroundColor: '#22C55E',
  },
  formatButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo-Bold',
    color: '#374151',
  },
  formatButtonTextActive: {
    color: '#ffffff',
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  fontSizeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  fontSizeText: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#374151',
  },
});