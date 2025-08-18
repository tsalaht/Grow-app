import axiosInstance from './axiosInstance';
import { 
  ApiResponse, 
  NotificationResponse, 
  NotificationSettings, 
  NotificationCategory,
  NotificationType 
} from '../../types/api';

export class NotificationsApi {
  /**
   * Get all notifications
   */
  static async getNotifications(): Promise<ApiResponse<NotificationResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NotificationResponse[]>>('/get-noti');
      return response.data;
    } catch (error: any) {
      console.error('Get notifications error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notifications',
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markRead(id: string): Promise<ApiResponse<NotificationResponse>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<NotificationResponse>>(`/read-noti/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Mark read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to mark notification as read',
      };
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(id: string): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>(`/delete-noti/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete notification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete notification',
      };
    }
  }

  /**
   * Delete all notifications
   */
  static async deleteAllNotifications(): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse>('/delete-all-noti');
      return response.data;
    } catch (error: any) {
      console.error('Delete all notifications error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete all notifications',
      };
    }
  }

  /**
   * Get notification settings
   */
  static async getNotiSettings(): Promise<ApiResponse<NotificationSettings[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NotificationSettings[]>>('/noti-settings');
      return response.data;
    } catch (error: any) {
      console.error('Get notification settings error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notification settings',
      };
    }
  }

  /**
   * Update notification setting
   */
  static async updateNotiSetting(id: string, enabled: boolean): Promise<ApiResponse<NotificationSettings>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<NotificationSettings>>(`/noti-settings/${id}`, {
        enabled,
      });
      return response.data;
    } catch (error: any) {
      console.error('Update notification setting error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update notification setting',
      };
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await axiosInstance.get<ApiResponse<{ count: number }>>('/unread-noti-count');
      return response.data;
    } catch (error: any) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get unread count',
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.patch<ApiResponse>('/mark-all-read');
      return response.data;
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to mark all as read',
      };
    }
  }

  /**
   * Get notifications by category
   */
  static async getNotificationsByCategory(category: NotificationCategory): Promise<ApiResponse<NotificationResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<NotificationResponse[]>>(`/get-noti-by-category?category=${category}`);
      return response.data;
    } catch (error: any) {
      console.error('Get notifications by category error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get notifications by category',
      };
    }
  }
}
