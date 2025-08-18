import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image as RNImage,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Edit2 } from 'lucide-react-native';
import { useNotes } from '@/hooks/useApiData';
import { Note } from '@/types/Note';

export default function ShowNotesScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useNotes();
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const mapped = data.map((n: any) => ({
        ...n,
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));
      const sorted = mapped.sort((a: any, b: any) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setNotes(sorted);
    }
  }, [data]);

  const handleEditNote = (noteId: string) => {
    router.push({ pathname: '/EditNoteScreen', params: { noteId } });
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => handleEditNote(item.id)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        {item.isPinned && <Bookmark size={20} color="#FFD700" />}
      </View>
      <Text style={[styles.noteContent, {
        fontSize: item.fontSize || 16,
        textAlign: item.textAlignment || 'right',
        fontWeight: item.textFormats?.includes('bold') ? 'bold' : 'normal',
        fontStyle: item.textFormats?.includes('italic') ? 'italic' : 'normal',
        textDecorationLine: item.textFormats?.includes('underline') ? 'underline' : 'none',
      }]} numberOfLines={3}>
        {item.content}
      </Text>
      {item.imageUri && (
        <RNImage
          source={{ uri: item.imageUri }}
          style={styles.noteImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {new Date(item.updatedAt).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' '}
          {new Date(item.updatedAt).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        <TouchableOpacity onPress={() => handleEditNote(item.id)}>
          <Edit2 size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>الملاحظات</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا توجد ملاحظات بعد</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  noteCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#111827',
    textAlign: 'right',
  },
  noteContent: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 8,
  },
  noteImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    color: '#374151',
  },
});