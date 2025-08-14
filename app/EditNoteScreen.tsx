import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  I18nManager,
  Animated,
  TextStyle,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, MoveHorizontal as MoreHorizontal, Save, Undo2, Redo2, Users, Bookmark, Star, Smile, Image, AlignLeft, Type, Clock, Trash2 } from 'lucide-react-native';
import { NotesService } from '../services/NotesService';
import { ReminderModal } from './Components/ReminderModal';
import { TextFormattingModal } from './Components/TextFormattingModal';
import { Note } from '@/types/Note';



export default function EditNoteScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [isFormattingModalVisible, setIsFormattingModalVisible] = useState(false);
  const [reminder, setReminder] = useState<Date | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('right');
  const [textFormats, setTextFormats] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Undo/Redo states
  const [history, setHistory] = useState<Array<{title: string, content: string}>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Animation states
  const [saveButtonScale] = useState(new Animated.Value(1));
  const [isSaving, setIsSaving] = useState(false);
  const [reminderButtonScale] = useState(new Animated.Value(1));
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      if (typeof noteId !== 'string') {
        Alert.alert('خطأ', 'معرف الملاحظة غير صالح');
        router.back();
        return;
      }
      try {
        const note = await NotesService.getNoteById(noteId);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setIsPinned(note.isPinned);
          setReminder(note.reminder ?? null);
          setFontSize(note.fontSize || 16);
          setTextAlignment(note.textAlignment || 'right');
          setTextFormats(note.textFormats || []);
          setSelectedImage(note.imageUri || null);
          setHistory([{ title: note.title, content: note.content }]);
          setHistoryIndex(0);
        } else {
          Alert.alert('خطأ', 'الملاحظة غير موجودة');
          router.back();
        }
      } catch (error) {
        Alert.alert('خطأ', 'فشل في تحميل الملاحظة');
        router.back();
      }
    };
    loadNote();
  }, [noteId]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('خطأ', 'يجب منح إذن الوصول إلى مكتبة الصور');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      saveToHistory(title, content);
    }
  };

  const saveToHistory = (newTitle: string, newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ title: newTitle, content: newContent });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setTitle(previousState.title);
      setContent(previousState.content);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setTitle(nextState.title);
      setContent(nextState.content);
      setHistoryIndex(newIndex);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    saveToHistory(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    saveToHistory(title, newContent);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان للملاحظة');
      return;
    }

    setIsSaving(true);
    Animated.sequence([
      Animated.timing(saveButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveButtonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const updatedNote: Note = {
        id: noteId as string,
        title: title.trim(),
        content: content.trim(),
        isPinned,
        reminder,
        tags: [],
        isTask: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUri: selectedImage,
        textFormats,
        fontSize,
        textAlignment,
      };

      await NotesService.updateNote(updatedNote);
      
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert('تم الحفظ', 'تم تحديث الملاحظة بنجاح', [
          { text: 'موافق', onPress: () => router.back() }
        ]);
      }, 300);
    } catch (error) {
      setIsSaving(false);
      Alert.alert('خطأ', 'لم يتم تحديث الملاحظة');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه الملاحظة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotesService.deleteNote(noteId as string);
              Alert.alert('تم الحذف', 'تم حذف الملاحظة بنجاح', [
                { text: 'موافق', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('خطأ', 'لم يتم حذف الملاحظة');
            }
          },
        },
      ]
    );
  };

  const handleSetReminder = (selectedDate: Date) => {
    setReminder(selectedDate);
    setIsReminderModalVisible(false);
  };

  const handleFormatChange = (format: string) => {
    if (format.startsWith('align-')) {
      const alignment = format.replace('align-', '') as 'left' | 'center' | 'right' | 'justify';
      setTextAlignment(alignment);
    } else if (format === 'increase-font') {
      setFontSize(prev => Math.min(prev + 2, 24));
    } else if (format === 'decrease-font') {
      setFontSize(prev => Math.max(prev - 2, 12));
    } else {
      setTextFormats(prev => 
        prev.includes(format) 
          ? prev.filter(f => f !== format)
          : [...prev, format]
      );
    }
    saveToHistory(title, content);
  };

  const getTextStyle = () => {
    const style: TextStyle = {
      fontSize,
      textAlign: textAlignment,
      fontWeight: textFormats.includes('bold') ? 'bold' : 'normal',
      fontStyle: textFormats.includes('italic') ? 'italic' : 'normal',
      textDecorationLine: textFormats.includes('underline') ? 'underline' : 'none',
    };
    return style;
  };

  const handleReminderPress = () => {
    setIsSettingReminder(true);
    Animated.sequence([
      Animated.timing(reminderButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(reminderButtonScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(reminderButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSettingReminder(false);
      setIsReminderModalVisible(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <TouchableOpacity 
            style={[styles.headerButton, historyIndex <= 0 && styles.headerButtonDisabled]}
            onPress={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo2 size={20} color={historyIndex <= 0 ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, historyIndex >= history.length - 1 && styles.headerButtonDisabled]}
            onPress={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo2 size={20} color={historyIndex >= history.length - 1 ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Users size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsPinned(!isPinned)}
          >
            <Bookmark size={20} color={isPinned ? "#FFD700" : "#ffffff"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsPinned(!isPinned)}
          >
            <Star size={20} color={isPinned ? "#FFD700" : "#ffffff"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={[styles.titleInput, getTextStyle()]}
          placeholder="عنوان الملاحظة..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={handleTitleChange}
          textAlign="right"
          multiline
        />
        {selectedImage && (
          <View style={styles.imageContainer}>
            <RNImage
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
              resizeMode="contain"
            />
          </View>
        )}
        <TextInput
          style={[styles.contentInput, getTextStyle()]}
          placeholder="اكتب ملاحظتك هنا..."
          placeholderTextColor="#6B7280"
          value={content}
          onChangeText={handleContentChange}
          textAlign="right"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        <View style={styles.toolbarCenterFull}>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={pickImage}
          >
            <Image size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setIsFormattingModalVisible(true)}
          >
            <AlignLeft size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Smile size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setIsFormattingModalVisible(true)}
          >
            <Type size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbarActionsRow}>
          <Animated.View 
            style={[styles.toolbarActionWrapper, { transform: [{ scale: reminderButtonScale }], opacity: isSettingReminder ? 0.8 : 1 }]}
          >
            <TouchableOpacity 
              style={[styles.buttonContainer, styles.reminderButtonContainer]}
              onPress={handleReminderPress}
              disabled={isSettingReminder}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <Clock size={24} color="#ffffff" />
                <Text style={styles.buttonText}>
                  {isSettingReminder ? 'جاري التعيين...' : 'تعيين تذكير'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            style={[styles.toolbarActionWrapper, { transform: [{ scale: saveButtonScale }], opacity: isSaving ? 0.8 : 1 }]}
          >
            <TouchableOpacity 
              style={[styles.buttonContainer, styles.saveButtonContainer]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <Save size={24} color="#ffffff" />
                <Text style={styles.buttonText}>
                  {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <ReminderModal
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
        onSetReminder={handleSetReminder}
        currentReminder={reminder}
      />
      <TextFormattingModal
        visible={isFormattingModalVisible}
        onClose={() => setIsFormattingModalVisible(false)}
        onFormatChange={handleFormatChange}
        currentFontSize={fontSize}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerCenter: {
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    paddingVertical: 16,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    lineHeight: 24,
    textAlign: 'right',
    minHeight: 400,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  bottomToolbar: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  toolbarCenterFull: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolbarActionsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toolbarActionWrapper: {
    flex: 1,
  },
  toolbarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonContainer: {
    backgroundColor: '#22C55E',
  },
  reminderButtonContainer: {
    backgroundColor: '#052814',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    color: '#ffffff',
  },
});