import axiosInstance from './axiosInstance';
import { ApiResponse, LoginRequest, LoginResponse } from '../../types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthApi {
  /**
   * Login with Google ID token
   */
  static async loginWithGoogle(idToken: string, fcmToken: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth-google', {
        idToken,
        fcmToken,
      });

      if (response.data.success && response.data.data) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed',
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse>('/logout');
      
      // Clear local storage regardless of server response
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Clear local storage even if server request fails
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Logout failed',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get stored user data
   */
  static async getUserData(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}
