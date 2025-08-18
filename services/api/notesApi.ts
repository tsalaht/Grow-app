import axiosInstance from './axiosInstance';
import { ApiResponse, NoteRequest, NoteResponse, NoteCategory } from '../../types/api';

export class NotesApi {
  /**
   * Create a new note
   */
  static async createNote(data: NoteRequest): Promise<ApiResponse<NoteResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<NoteResponse>>('/create-note', data);
      return response.data;
    } catch (error: any) {
      console.error('Create note error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create note',
      };
    }
  }

  /**
   * Update a note
   */
  static async updateNote(id: string, data: Partial<NoteRequest>): Promise<ApiResponse<NoteResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<NoteResponse>>(`/update-note/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update note error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update note',
      };
    }
  }

  /**
   * Get all notes
   */
  static async getAllNotes(): Promise<ApiResponse<NoteResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NoteResponse[]>>('/get-all-notes');
      return response.data;
    } catch (error: any) {
      console.error('Get all notes error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notes',
      };
    }
  }

  /**
   * Get notes by category
   */
  static async getNotesByCategory(category: NoteCategory): Promise<ApiResponse<NoteResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NoteResponse[]>>(`/get-note-by-category?category=${category}`);
      return response.data;
    } catch (error: any) {
      console.error('Get notes by category error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notes by category',
      };
    }
  }

  /**
   * Delete a note
   */
  static async deleteNote(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-note/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete note error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete note',
      };
    }
  }

  /**
   * Get pinned notes
   */
  static async getPinnedNotes(): Promise<ApiResponse<NoteResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NoteResponse[]>>('/get-pinned-notes');
      return response.data;
    } catch (error: any) {
      console.error('Get pinned notes error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get pinned notes',
      };
    }
  }

  /**
   * Toggle note pin status
   */
  static async togglePinNote(id: string): Promise<ApiResponse<NoteResponse>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<NoteResponse>>(`/toggle-pin-note/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Toggle pin note error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to toggle pin note',
      };
    }
  }

  /**
   * Search notes
   */
  static async searchNotes(query: string): Promise<ApiResponse<NoteResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NoteResponse[]>>(`/search-notes?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      console.error('Search notes error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to search notes',
      };
    }
  }

  /**
   * Get notes with reminders
   */
  static async getNotesWithReminders(): Promise<ApiResponse<NoteResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NoteResponse[]>>('/get-notes-with-reminders');
      return response.data;
    } catch (error: any) {
      console.error('Get notes with reminders error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notes with reminders',
      };
    }
  }
}
