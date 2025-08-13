import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { Star, Clock, Tag, List, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Note } from '@/types/Note';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onPress, onTogglePin, onDelete }: NoteCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatReminderTime = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCardColor = () => {
    if (note.isPinned) return '#B8860B'; // ذهبي للمثبتة
    if (note.reminder) return '#22C55E'; // أخضر للتذكيرات
    if (note.isTask) return '#3B82F6'; // أزرق للمهام
    return '#2D3748'; // رمادي داكن للعادية
  };

  const getBorderColor = () => {
    if (note.isPinned) return '#F59E0B';
    if (note.reminder) return '#22C55E';
    if (note.isTask) return '#3B82F6';
    return '#e5e7eb';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { 
          backgroundColor: getCardColor(),
          borderColor: getBorderColor()
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardIcons}>
          {note.isPinned && (
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
          )}
          {note.isTask && (
            <List size={16} color="#3B82F6" />
          )}
          {note.tags && note.tags.length > 0 && (
            <Tag size={16} color="#6B7280" />
          )}
        </View>
        <TouchableOpacity onPress={onTogglePin}>
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {note.title}
      </Text>

      {/* Content Preview */}
      <Text style={styles.cardContent} numberOfLines={3}>
        {note.content}
      </Text>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          {note.reminder && (
            <View style={styles.reminderChip}>
              <Clock size={12} color="#15803D" />
              <Text style={styles.reminderChipText}>
                {formatReminderTime(note.reminder)}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.dateText}>
          {formatDate(note.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#ffffff',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 24,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#E2E8F0',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reminderChipText: {
    fontSize: 12,
    fontFamily: 'Cairo-Bold',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
});