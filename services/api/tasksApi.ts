import axiosInstance from './axiosInstance';
import { ApiResponse, TaskRequest, TaskResponse, TaskType } from '../../types/api';

export class TasksApi {
  /**
   * Create a new task
   */
  static async createTask(data: TaskRequest): Promise<ApiResponse<TaskResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<TaskResponse>>('/create-task', data);
      return response.data;
    } catch (error: any) {
      console.error('Create task error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create task',
      };
    }
  }

  /**
   * Get tasks by type
   */
  static async getTasks(type: TaskType): Promise<ApiResponse<TaskResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TaskResponse[]>>(`/get-tasks?type=${type}`);
      return response.data;
    } catch (error: any) {
      console.error('Get tasks error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get tasks',
      };
    }
  }

  /**
   * Update a task
   */
  static async updateTask(id: string, data: Partial<TaskRequest>): Promise<ApiResponse<TaskResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<TaskResponse>>(`/update-task/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update task error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update task',
      };
    }
  }

  /**
   * Toggle task completion status
   */
  static async toggleTask(id: string): Promise<ApiResponse<TaskResponse>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<TaskResponse>>(`/toggle-task/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Toggle task error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to toggle task',
      };
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-task/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete task error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete task',
      };
    }
  }

  /**
   * Get all tasks (without type filter)
   */
  static async getAllTasks(): Promise<ApiResponse<TaskResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TaskResponse[]>>('/get-all-tasks');
      return response.data;
    } catch (error: any) {
      console.error('Get all tasks error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get all tasks',
      };
    }
  }

  /**
   * Get tasks by category
   */
  static async getTasksByCategory(category: 'daily' | 'weekly' | 'monthly'): Promise<ApiResponse<TaskResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TaskResponse[]>>(`/get-tasks-by-category?category=${category}`);
      return response.data;
    } catch (error: any) {
      console.error('Get tasks by category error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get tasks by category',
      };
    }
  }
}
