import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather as Icon } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  editingTask: string | null;
  editFormData: Partial<Task>;
  expandedNotes: string[];
  onToggleCompletion: (task: Task) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onToggleNoteExpansion: (taskId: string) => void;
  onSetEditFormData: (data: Partial<Task>) => void;
  onSetEditReminderVisible: (visible: boolean) => void;
}

const { width } = Dimensions.get('window');

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  editingTask,
  editFormData,
  expandedNotes,
  onToggleCompletion,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onDuplicate,
  onUpdateTask,
  onToggleNoteExpansion,
  onSetEditFormData,
  onSetEditReminderVisible,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' };
      case 'important':
        return { backgroundColor: '#fef9c3', color: '#a16207', borderColor: '#fef08a' };
      case 'normal':
        return { backgroundColor: '#d1fae5', color: '#15803d', borderColor: '#a7f3d0' };
      case 'low':
        return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'عاجل 🔥';
      case 'important':
        return 'مهم 🟡';
      case 'normal':
        return 'عادي 🟢';
      case 'low':
        return 'منخفض 🔵';
      default:
        return 'عادي';
    }
  };

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

  return (
    <TouchableOpacity 
      style={styles.taskCard} 
      activeOpacity={1}
      onPress={() => {
        console.log('Task card pressed:', task.id);
      }}
    >
      {editingTask === task.id ? (
        <View style={styles.editContainer}>
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>✏️ تعديل المهمة</Text>
            <View style={styles.editButtons}>
              <TouchableOpacity onPress={onSaveEdit} style={styles.saveButton}>
                <Text style={styles.buttonText}>حفظ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancelEdit} style={styles.cancelButton}>
                <Text style={styles.buttonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.editForm}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.titleInput}
                value={editFormData.title || ''}
                onChangeText={(text) => onSetEditFormData({ ...editFormData, title: text })}
                placeholder="عنوان المهمة"
              />
              <TextInput
                style={styles.iconInput}
                value={editFormData.icon || ''}
                onChangeText={(text) => onSetEditFormData({ ...editFormData, icon: text })}
                placeholder="🎯"
              />
            </View>
            <TextInput
              style={styles.notesInput}
              value={editFormData.notes || ''}
              onChangeText={(text) => onSetEditFormData({ ...editFormData, notes: text })}
              placeholder="الملاحظات"
              multiline
            />
            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <Text style={styles.label}>الأولوية</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={editFormData.priority || 'normal'}
                    onValueChange={(value) => onSetEditFormData({ ...editFormData, priority: value })}
                    style={styles.pickerText}
                    itemStyle={styles.pickerText}
                  >
                    <Picker.Item label="عاجل 🔥" value="urgent" />
                    <Picker.Item label="مهم 🟡" value="important" />
                    <Picker.Item label="عادي 🟢" value="normal" />
                    <Picker.Item label="منخفض 🔵" value="low" />
                  </Picker>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>المدة</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.estimatedDuration?.toString() || '30'}
                  onChangeText={(text) => onSetEditFormData({ ...editFormData, estimatedDuration: parseInt(text) || 30 })}
                  keyboardType="numeric"
                  placeholder="المدة"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>التاريخ والوقت</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => onSetEditReminderVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, color: '#15803d', textAlign: 'right', fontFamily: 'Tajawal_400Regular' }}>
                    {(editFormData.date && editFormData.time) ? `${editFormData.date} ${editFormData.time}` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleRow}>
              <TouchableOpacity
                onPress={() => onToggleCompletion(task)}
                style={styles.checkCircleContainer}
              >
                <View style={[
                  styles.checkCircle,
                  task.status === 'completed' && styles.checkCircleCompleted
                ]}>
                  {task.status === 'completed' && (
                    <Icon name="check" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.taskIcon}>{task.icon}</Text>
              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.status === 'completed' && styles.completedTask,
                  ]}
                >
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={[styles.priorityBadge, getPriorityColor(task.priority)]}>
                    <Text style={styles.priorityText}>{getPriorityLabel(task.priority)}</Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Icon name="calendar" size={12} color="#15803d" />
                    <Text style={styles.dateText}>{task.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {task.notes && (
            <View style={styles.notesContainer}>
              <Text
                style={[
                  styles.notesText,
                  !expandedNotes.includes(task.id) && styles.notesClamped,
                ]}
                numberOfLines={expandedNotes.includes(task.id) ? undefined : 2}
              >
                {task.notes}
              </Text>
              <TouchableOpacity onPress={() => onToggleNoteExpansion(task.id)}>
                <Text style={styles.notesToggle}>
                  {expandedNotes.includes(task.id) ? 'إخفاء' : 'عرض المزيد'}
                </Text>
              </TouchableOpacity>
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
                  style={[styles.progressFill, { width: `${task.progress}%` }]}
                />
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={10}
                value={task.progress}
                onValueChange={(value) => {
                  const newProgress = Math.round(value);
                  const newStatus = newProgress === 100 ? 'completed' : 'in-progress';
                  onUpdateTask(task.id, { progress: newProgress, status: newStatus });
                }}
                minimumTrackTintColor="#22c55e"
                maximumTrackTintColor="#d1fae5"
              />
            </View>
          )}
          {task.status === 'completed' && (
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={14} color="#15803d" />
              <Text style={styles.completedText}>مهمة مكتملة ✅</Text>
            </View>
          )}
          <View style={styles.actionsContainer}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Edit task:', task.id);
                  onStartEdit(task);
                }}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Icon name="edit-2" size={20} color="#3b82f6" />
                <Text style={styles.actionButtonText}>تعديل</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  console.log('Delete task:', task.id);
                  onDelete(task.id);
                }}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Icon name="trash-2" size={20} color="#ef4444" />
                <Text style={styles.actionButtonText}>حذف</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  console.log('Duplicate task:', task.id);
                  onDuplicate(task);
                }}
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <Icon name="copy" size={20} color="#8b5cf6" />
                <Text style={styles.actionButtonText}>نسخ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.durationRow}>
              <Icon name="clock" size={12} color="#15803d" />
              <Text style={styles.durationText}>{task.estimatedDuration} دقيقة</Text>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleRow: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
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
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  taskIcon: {
    fontSize: 20,
    fontFamily: 'Tajawal_400Regular',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#22c55e',
  },
  taskMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  dateRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#22c55e',
    fontFamily: 'Tajawal_400Regular',
  },
  notesContainer: {
    marginBottom: 8,
    alignSelf: "flex-end"
  },
  notesText: {
    fontSize: 12,
    color: '#15803d',
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 8,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  notesClamped: {
    maxHeight: 40,
  },
  notesToggle: {
    fontSize: 12,
    color: '#22c55e',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Tajawal_400Regular',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#22c55e',
    fontFamily: 'Tajawal_400Regular',
    flexDirection: 'row-reverse',
  },
  progressValue: {
    fontSize: 12,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#d1fae5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  slider: {
    marginTop: 4,
  },
  completedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 12,
    color: '#15803d',
    marginLeft: 4,
    fontFamily: 'Tajawal_400Regular',
  },
  actionsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#a7f3d0',
  },
  actionButtons: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 60,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 11,
    color: '#374151',
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  durationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#22c55e',
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
    backgroundColor: '#22c55e',
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
  inputRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  titleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#a7f3d0',
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
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    textAlign: 'center',
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    textAlignVertical: 'top',
    fontFamily: 'Tajawal_400Regular',
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
  label: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 12,
    color: '#15803d',
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});

export default TaskCard;
