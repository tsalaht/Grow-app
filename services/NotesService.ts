import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/types/Note';

const NOTES_KEY = 'notes_storage';

export class NotesService {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        reminder: note.reminder ? new Date(note.reminder) : null,
      }));
    } catch (error) {
      console.error('خطأ في تحميل الملاحظات:', error);
      return [];
    }
  }

  static async getNoteById(id: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('خطأ في تحميل الملاحظة:', error);
      return null;
    }
  }

  static async createNote(noteData: Omit<Note, 'id'>): Promise<string> {
    try {
      const notes = await this.getAllNotes();
      const newNote: Note = {
        ...noteData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      
      notes.unshift(newNote); // إضافة في المقدمة
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      return newNote.id;
    } catch (error) {
      console.error('خطأ في إنشاء الملاحظة:', error);
      throw error;
    }
  }

  static async updateNote(updatedNote: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const index = notes.findIndex(note => note.id === updatedNote.id);
      
      if (index !== -1) {
        notes[index] = updatedNote;
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      }
    } catch (error) {
      console.error('خطأ في تحديث الملاحظة:', error);
      throw error;
    }
  }

  static async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('خطأ في حذف الملاحظة:', error);
      throw error;
    }
  }

  static async togglePin(id: string): Promise<void> {
    try {
      const note = await this.getNoteById(id);
      if (note) {
        note.isPinned = !note.isPinned;
        note.updatedAt = new Date();
        await this.updateNote(note);
      }
    } catch (error) {
      console.error('خطأ في تثبيت الملاحظة:', error);
      throw error;
    }
  }

  static async searchNotes(query: string): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      return notes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('خطأ في البحث:', error);
      return [];
    }
  }
}