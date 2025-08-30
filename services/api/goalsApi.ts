import axiosInstance from './axiosInstance';
import { ApiResponse, GoalRequest, GoalResponse, GoalType } from '../../types/api';

export class GoalsApi {
  /**
   * Add a new goal
   */
  static async addGoal(data: GoalRequest): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<GoalResponse>>('/add-goal', data);
      return response.data;
    } catch (error: any) {
      console.error('Add goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add goal',
      };
    }
  }

  /**
   * Get all goals
   */
  static async getGoals(): Promise<ApiResponse<GoalResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<GoalResponse[]>>('/get-goals');
      return response.data;
    } catch (error: any) {
      console.error('Get goals error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get goals',
      };
    }
  }

  /**
   * Add new amount to a goal
   */
  static async addNewAmount(id: string, amount: number): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<GoalResponse>>(`/add-new-amount/${id}`, {
        amount,
      });
      return response.data;
    } catch (error: any) {
      console.error('Add new amount error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add new amount',
      };
    }
  }

  /**
   * Update a goal
   */
  static async updateGoal(id: string, data: Partial<GoalRequest>): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<GoalResponse>>(`/update-goal/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update goal',
      };
    }
  }

  /**
   * Delete a goal
   */
  static async deleteGoal(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-goal/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete goal error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete goal',
      };
    }
  }

  /**
   * Get goals by type
   */
  static async getGoalsByType(type: GoalType): Promise<ApiResponse<GoalResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<GoalResponse[]>>(`/get-goals-by-type?type=${type}`);
      return response.data;
    } catch (error: any) {
      console.error('Get goals by type error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get goals by type',
      };
    }
  }

  /**
   * Get goal progress
   */
  static async getGoalProgress(id: string): Promise<ApiResponse<GoalResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<GoalResponse>>(`/goal-progress/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get goal progress error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get goal progress',
      };
    }
  }
}
