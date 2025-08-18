import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, MoveHorizontal as MoreHorizontal, Save, Undo2, Redo2, Users, Bookmark, Star, Smile, Image, Mic, AlignLeft, Type, Clock,Notebook, Trash2 } from 'lucide-react-native';
import { NoteCategory } from '@/services/api';
import { useCreateNote } from '@/hooks/useApiData';
import { ReminderModal } from '../Components/ReminderModal';
import { TextFormattingModal}  from '../Components/TextFormattingModal';
import { Note } from '@/types/Note';



export default function CreateNoteScreen() {
  const router = useRouter();
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
      saveToHistory(title, content); // Save state to history after picking image
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

  const { mutate: createNote } = useCreateNote();
  const clearAll = () => {
    setTitle('');
    setContent('');
    setIsPinned(false);
    setReminder(null);
    setSelectedImage(null);
    setTextFormats([]);
    setFontSize(16);
    setTextAlignment('right');
    setHistory([]);
    setHistoryIndex(-1);
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
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category: NoteCategory.OTHER,
        isPinned,
        reminder: reminder ? new Date(reminder).toISOString() : undefined,
        tags: [],
        isTask: false,
        color: undefined,
        fontSize,
        textAlignment: textAlignment === 'justify' ? 'right' : textAlignment,
        textFormats,
        imageUri: selectedImage || undefined,
      } as any;

      const result = await createNote(payload);
      if (result?.success) {
        setTimeout(() => {
          setIsSaving(false);
          Alert.alert('تم الحفظ', 'تم حفظ الملاحظة بنجاح', [
            { text: 'موافق', onPress: () => router.push('/ShowNotesScreen') }
          ]);
        }, 300);
      } else {
        setIsSaving(false);
        Alert.alert('خطأ', result?.error || 'لم يتم حفظ الملاحظة');
      }
    } catch (error) {
      setIsSaving(false);
      Alert.alert('خطأ', 'لم يتم حفظ الملاحظة');
    }
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
    } else if (format === 'bullet-list') {
      setContent(prev => prev + '\n• ');
    } else if (format === 'numbered-list') {
      setContent(prev => {
        const lines = prev.split('\n');
        const nextNumber = lines.length;
        return prev + `\n${nextNumber}. `;
      });
    } else {
      setTextFormats(prev => 
        prev.includes(format) 
          ? prev.filter(f => f !== format)
          : [...prev, format]
      );
    }
    saveToHistory(title, content); // Save state to history after formatting change
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
            style={[
              styles.headerButton,
              historyIndex <= 0 && styles.headerButtonDisabled
            ]}
            onPress={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo2 size={20} color={historyIndex <= 0 ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerButton,
              historyIndex >= history.length - 1 && styles.headerButtonDisabled
            ]}
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
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <TextInput
          style={[styles.titleInput,]} // Apply formatting to title
          placeholder="عنوان الملاحظة..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={handleTitleChange}
          textAlign="right"
          multiline
        />

        {/* Selected Image Display */}
     {selectedImage && (
          <View style={styles.imageContainer}>
            <RNImage
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageButtonText}>إزالة الصورة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content Input */}
        
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
        {/* Center Section */}
        <View style={styles.toolbarCenterFull}>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={pickImage}
          >
            <Image size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setIsFormattingModalVisible(true)}
          >
            <AlignLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setIsFormattingModalVisible(true)}
          >
            <Type size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Actions Row */}
        <View style={styles.toolbarActionsRow}>
          <Animated.View 
            style={[
              styles.toolbarActionWrapper,
              { transform: [{ scale: reminderButtonScale }], opacity: isSettingReminder ? 0.8 : 1 }
            ]}
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
            style={[
              styles.toolbarActionWrapper,
              { transform: [{ scale: saveButtonScale }], opacity: isSaving ? 0.8 : 1 }
            ]}
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

          <Animated.View style={styles.toolbarActionWrapper}>
            <TouchableOpacity 
              style={[styles.buttonContainer, styles.clearButtonContainer]}
              onPress={clearAll}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <Trash2 size={24} color="#ffffff" />
                <Text style={styles.buttonText}>مسح الكل</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
                <TouchableOpacity 
              style={[styles.buttonContainer, styles.reminderButtonContainer,{marginTop: 10}]}
            onPress={() => router.push('/ShowNotesScreen')}
              disabled={isSettingReminder}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <Notebook size={24} color="#ffffff" />
                <Text style={styles.buttonText}>
             جميع الملاحظات
                </Text>
              </View>
            </TouchableOpacity>
      </View>

      {/* Reminder Modal */}
      <ReminderModal
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
        onSetReminder={handleSetReminder}
        currentReminder={reminder}
      />

      {/* Text Formatting Modal */}
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
  removeImageButton: {
    marginTop: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
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
    backgroundColor: '#15803d',
  },
  buttonContainer: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonContainer: {
    backgroundColor: '#15803d',
  },
  reminderButtonContainer: {
    backgroundColor: '#15803d',
  },
  clearButtonContainer: {
    backgroundColor: '#15803d',
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