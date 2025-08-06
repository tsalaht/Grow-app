import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { Brain, Plus, Search, Filter, CreditCard as Edit3, Trash2, Bell, BellOff, Calendar, Clock, Repeat, X, Check, Phone, Target, Lightbulb, FileText, Briefcase, BookOpen, MapPin, Folder } from 'lucide-react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import NotificationService from '@/services/NotificationService';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'development' | 'follow-up' | 'other';
  createdAt: Date;
  updatedAt: Date;
  hasReminder: boolean;
  reminderSettings?: {
    enabled: boolean;
    type: 'hourly' | 'every-2-hours' | 'after-time' | 'specific-time' | 'tomorrow' | 'custom';
    time?: string;
    date?: Date;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  };
  isActive: boolean;
  detectedKeywords: string[];
}

interface Category {
  id: 'work' | 'development' | 'follow-up' | 'other';
  name: string;
  emoji: string;
  color: string;
}

const categories: Category[] = [
  { id: 'work', name: 'عمل', emoji: '💼', color: '#3B82F6' },
  { id: 'development', name: 'تطوير ذاتي', emoji: '📚', color: '#095028' },
  { id: 'follow-up', name: 'متابعة', emoji: '📍', color: '#F59E0B' },
  { id: 'other', name: 'أخرى', emoji: '🗂️', color: '#6B7280' },
];

const keywordIcons: { [key: string]: React.ReactNode } = {
  'اتصال': <Phone size={16} color="#3B82F6" />,
  'خطة': <FileText size={16} color="#10B981" />,
  'هدف': <Target size={16} color="#EF4444" />,
  'فكرة': <Lightbulb size={16} color="#F59E0B" />,
};

const reminderTypes = [
  { id: 'hourly', name: 'كل ساعة', emoji: '⏰' },
  { id: 'every-2-hours', name: 'كل ساعتين', emoji: '⏰' },
  { id: 'after-time', name: 'بعد وقت معين', emoji: '⏰' },
  { id: 'specific-time', name: 'وقت محدد من اليوم', emoji: '⏰' },
  { id: 'tomorrow', name: 'غداً في وقت معين', emoji: '📅' },
  { id: 'custom', name: 'اختيار يوم + وقت', emoji: '📆' },
];

export default function SmartNotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [notificationService] = useState(() => NotificationService.getInstance());
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'other' as const,
  });

  const [reminderSettings, setReminderSettings] = useState({
    enabled: false,
    type: 'hourly' as const,
    time: '17:00',
    repeat: 'none' as const,
  });

  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  // كشف الكلمات المفتاحية
  const detectKeywords = (text: string): string[] => {
    const keywords = ['اتصال', 'خطة', 'هدف', 'فكرة'];
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // إضافة ملاحظة جديدة
  const addNote = async () => {
    if (!newNote.content.trim()) {
      Alert.alert('خطأ', 'يرجى كتابة محتوى الملاحظة');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim() || 'ملاحظة جديدة',
      content: newNote.content.trim(),
      category: newNote.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      hasReminder: reminderSettings.enabled,
      reminderSettings: reminderSettings.enabled ? {
        enabled: true,
        type: reminderSettings.type,
        time: reminderSettings.time,
        repeat: reminderSettings.repeat,
      } : undefined,
      isActive: true,
      detectedKeywords: detectKeywords(newNote.content),
    };

    setNotes([note, ...notes]);
    
    // جدولة إشعار الملاحظة الذكية إذا كان مفعلاً
    if (note.hasReminder && note.reminderSettings) {
      try {
        await NotificationService.getInstance().scheduleSmartNoteReminder(note);
      } catch (error) {
        console.error('خطأ في جدولة إشعار الملاحظة:', error);
      }
    }
    
    resetForm();
    setShowAddNote(false);
    Alert.alert('تم الحفظ', 'تم إضافة الملاحظة بنجاح');
  };

  const resetForm = () => {
    setNewNote({ title: '', content: '', category: 'other' });
    setReminderSettings({ enabled: false, type: 'hourly', time: '17:00', repeat: 'none' });
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'حذف الملاحظة',
      'هل أنت متأكد من حذف هذه الملاحظة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => {
          setNotes(notes.filter(note => note.id !== id));
        }},
      ]
    );
  };

  const toggleNoteStatus = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isActive: !note.isActive } : note
    ));
  };

  // تصفية الملاحظات
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && note.isActive) ||
                         (filterStatus === 'inactive' && !note.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!fontsLoaded) {
    return null;
  }

  // صفحة إضافة ملاحظة جديدة
  if (showAddNote) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.addNoteHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              setShowAddNote(false);
              resetForm();
            }}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.addNoteTitle}>إضافة ملاحظة جديدة</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.addNoteContent} showsVerticalScrollIndicator={false}>
          {/* حقل العنوان */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>عنوان الملاحظة (اختياري)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="عنوان الملاحظة..."
              value={newNote.title}
              onChangeText={(text) => setNewNote({...newNote, title: text})}
              textAlign="right"
            />
          </View>

          {/* حقل المحتوى */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>محتوى الملاحظة</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="اكتب ملاحظتك هنا..."
              value={newNote.content}
              onChangeText={(text) => setNewNote({...newNote, content: text})}
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
            
            {/* عرض الكلمات المفتاحية المكتشفة */}
            {newNote.content && detectKeywords(newNote.content).length > 0 && (
              <View style={styles.detectedKeywords}>
                <Text style={styles.keywordsTitle}>كلمات مفتاحية مكتشفة:</Text>
                <View style={styles.keywordsList}>
                  {detectKeywords(newNote.content).map((keyword, index) => (
                    <View key={index} style={styles.keywordChip}>
                      {keywordIcons[keyword]}
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* تصنيف الملاحظة */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>تصنيف الملاحظة</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { borderColor: category.color },
                    newNote.category === category.id && { 
                      backgroundColor: category.color + '20',
                      borderWidth: 2 
                    }
                  ]}
                  onPress={() => setNewNote({...newNote, category: category.id})}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[styles.categoryName, { color: category.color }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* إعدادات التنبيه */}
          <View style={styles.inputGroup}>
            <View style={styles.reminderHeader}>
              <Text style={styles.inputLabel}>تنبيه ذكي</Text>
              <Switch
                value={reminderSettings.enabled}
                onValueChange={(value) => setReminderSettings({
                  ...reminderSettings, 
                  enabled: value
                })}
                trackColor={{ false: '#E5E7EB', true: '#A2E9C1' }}
                thumbColor={reminderSettings.enabled ? '#095028' : '#9CA3AF'}
              />
            </View>
            
            {reminderSettings.enabled && (
              <TouchableOpacity 
                style={styles.reminderSettingsButton}
                onPress={() => setShowReminderModal(true)}
              >
                <Bell size={20} color="#095028" />
                <Text style={styles.reminderSettingsText}>
                  إعدادات التنبيه
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* زر الحفظ */}
        <TouchableOpacity style={styles.saveButton} onPress={addNote}>
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>حفظ الملاحظة</Text>
        </TouchableOpacity>

        {/* نافذة إعدادات التنبيه */}
        <Modal
          visible={showReminderModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReminderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.reminderModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إعدادات التنبيه</Text>
                <TouchableOpacity onPress={() => setShowReminderModal(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <Text style={styles.sectionTitle}>نوع التنبيه</Text>
                {reminderTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.reminderOption,
                      reminderSettings.type === type.id && styles.selectedReminderOption
                    ]}
                    onPress={() => setReminderSettings({
                      ...reminderSettings, 
                      type: type.id as any
                    })}
                  >
                    <Text style={styles.reminderEmoji}>{type.emoji}</Text>
                    <Text style={styles.reminderOptionText}>{type.name}</Text>
                    {reminderSettings.type === type.id && (
                      <Check size={20} color="#095028" />
                    )}
                  </TouchableOpacity>
                ))}

                {(reminderSettings.type === 'specific-time' || 
                  reminderSettings.type === 'tomorrow') && (
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.sectionTitle}>الوقت</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="17:00"
                      value={reminderSettings.time}
                      onChangeText={(time) => setReminderSettings({
                        ...reminderSettings, 
                        time
                      })}
                      textAlign="center"
                    />
                  </View>
                )}

                <Text style={styles.sectionTitle}>التكرار</Text>
                {['none', 'daily', 'weekly', 'monthly'].map((repeat) => (
                  <TouchableOpacity
                    key={repeat}
                    style={[
                      styles.reminderOption,
                      reminderSettings.repeat === repeat && styles.selectedReminderOption
                    ]}
                    onPress={() => setReminderSettings({
                      ...reminderSettings, 
                      repeat: repeat as any
                    })}
                  >
                    <Text style={styles.reminderOptionText}>
                      {repeat === 'none' ? 'بدون تكرار' :
                       repeat === 'daily' ? 'يومياً' :
                       repeat === 'weekly' ? 'أسبوعياً' : 'شهرياً'}
                    </Text>
                    {reminderSettings.repeat === repeat && (
                      <Check size={20} color="#095028" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={() => setShowReminderModal(false)}
              >
                <Text style={styles.modalSaveButtonText}>تم</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // الصفحة الرئيسية لعرض الملاحظات
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Brain size={24} color="#095028" />
            <Text style={styles.title}>الملاحظات الذكية</Text>
          </View>
        </View>
        
        {/* شريط البحث والتصفية */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث في الملاحظات..."
            value={searchText}
            onChangeText={setSearchText}
            textAlign="right"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#095028" />
          </TouchableOpacity>
        </View>
      </View>

      {/* فلاتر التصنيف */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterCategory === 'all' && styles.activeFilterChip
              ]}
              onPress={() => setFilterCategory('all')}
            >
              <Text style={[
                styles.filterChipText,
                filterCategory === 'all' && styles.activeFilterChipText
              ]}>
                الكل ({notes.length})
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => {
              const count = notes.filter(note => note.category === category.id).length;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterChip,
                    filterCategory === category.id && styles.activeFilterChip
                  ]}
                  onPress={() => setFilterCategory(category.id)}
                >
                  <Text style={styles.filterEmoji}>{category.emoji}</Text>
                  <Text style={[
                    styles.filterChipText,
                    filterCategory === category.id && styles.activeFilterChipText
                  ]}>
                    {category.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* قائمة الملاحظات */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Brain size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>لا توجد ملاحظات</Text>
            <Text style={styles.emptySubtitle}>
              ابدأ بإضافة ملاحظاتك الذكية لتنظيم أفكارك
            </Text>
          </View>
        ) : (
          <View style={styles.notesList}>
            {filteredNotes.map((note) => {
              const category = categories.find(cat => cat.id === note.category);
              return (
                <View key={note.id} style={[
                  styles.noteCard,
                  { borderLeftColor: category?.color },
                  !note.isActive && styles.inactiveNoteCard
                ]}>
                  <View style={styles.noteHeader}>
                    <View style={styles.noteHeaderLeft}>
                      <Text style={styles.categoryEmoji}>{category?.emoji}</Text>
                      <View style={styles.noteInfo}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteDate}>
                          {note.createdAt.toLocaleDateString('ar-SA')}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.noteActions}>
                      {note.hasReminder && (
                        <View style={styles.reminderIndicator}>
                          <Bell size={14} color="#095028" />
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleNoteStatus(note.id)}
                      >
                        {note.isActive ? (
                          <BellOff size={16} color="#F59E0B" />
                        ) : (
                          <Bell size={16} color="#095028" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit3 size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteNote(note.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.noteContent}>{note.content}</Text>

                  {note.detectedKeywords.length > 0 && (
                    <View style={styles.noteKeywords}>
                      {note.detectedKeywords.map((keyword, index) => (
                        <View key={index} style={styles.keywordTag}>
                          {keywordIcons[keyword]}
                          <Text style={styles.keywordTagText}>{keyword}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.noteFooter}>
                    <Text style={[styles.categoryTag, { color: category?.color }]}>
                      {category?.name}
                    </Text>
                    <View style={styles.noteStatus}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: note.isActive ? '#10B981' : '#9CA3AF' }
                      ]} />
                      <Text style={styles.statusText}>
                        {note.isActive ? 'نشطة' : 'غير نشطة'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* زر الإضافة العائم */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setShowAddNote(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
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
    marginBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filtersList: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  activeFilterChip: {
    backgroundColor: '#095028',
  },
  filterEmoji: {
    fontSize: 12,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
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
  notesList: {
    gap: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inactiveNoteCard: {
    opacity: 0.6,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 2,
  },
  noteDate: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderIndicator: {
    backgroundColor: '#A2E9C1',
    borderRadius: 12,
    padding: 4,
  },
  actionButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'right',
  },
  noteKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  keywordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  keywordTagText: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
  },
  noteStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#095028',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  // صفحة إضافة ملاحظة
  addNoteHeader: {
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
  closeButton: {
    padding: 8,
  },
  addNoteTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  addNoteContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    backgroundColor: '#FFFFFF',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  detectedKeywords: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A2E9C1',
  },
  keywordsTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#095028',
    marginBottom: 8,
    textAlign: 'right',
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A2E9C1',
  },
  keywordText: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    color: '#095028',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A2E9C1',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  reminderSettingsText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    color: '#095028',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#095028',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
  // نافذة إعدادات التنبيه
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  reminderModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#1F2937',
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#374151',
    marginBottom: 12,
    marginTop: 16,
    textAlign: 'right',
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  selectedReminderOption: {
    backgroundColor: '#A2E9C1',
    borderWidth: 1,
    borderColor: '#095028',
  },
  reminderEmoji: {
    fontSize: 16,
  },
  reminderOptionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    textAlign: 'right',
  },
  timeInputGroup: {
    marginTop: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    backgroundColor: '#FFFFFF',
  },
  modalSaveButton: {
    backgroundColor: '#095028',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#FFFFFF',
  },
});