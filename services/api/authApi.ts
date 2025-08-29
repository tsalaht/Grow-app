import axiosInstance from './axiosInstance';
import { ApiResponse } from '../../types/api'; // Assuming ApiResponse is generic or adjust if needed
import AsyncStorage from '@react-native-async-storage/async-storage';

// Updated request/response types - add these to your types/api.ts or similar
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  fcmToken?: string;
}

export interface RegisterResponse {
  activationToken: string;
}

export interface ActivateRequest {
  activationToken: string;
  activationCode: string;
}

export interface ActivateResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    notificationSettings?: any[];
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    fcmToken?: string;
    lastLoginAt: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  resetCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse { } // Empty, just message in ApiResponse

export interface GetUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    fcmToken?: string;
    lastLoginAt?: string;
  };
}

export class AuthApi {
  /**
   * Register new user
   */
  static async register(
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<RegisterResponse>>(
        '/register',
        data
      );

      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed',
      };
    }
  }

  /**
   * Activate user account
   */
  static async activate(
    data: ActivateRequest
  ): Promise<ApiResponse<ActivateResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ActivateResponse>>(
        '/activate',
        data
      );

      if (response.data.success && response.data.data) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('Activation error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Activation failed',
      };
    }
  }

  /**
   * Login with email and password
   */
  static async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        '/login',
        data
      );

      if (response.data.success && response.data.data) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data.user)
        );
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
   * Forgot password - send reset code
   */
  static async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ForgotPasswordResponse>>(
        '/forgot-password',
        data
      );

      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Forgot password failed',
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<ResetPasswordResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ResetPasswordResponse>>(
        '/reset-password',
        data
      );

      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Reset password failed',
      };
    }
  }

  /**
   * Get logged-in user data from server
   */
  static async getUser(): Promise<ApiResponse<GetUserResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<GetUserResponse>>('/get-user');

      if (response.data.success && response.data.data) {
        // Update stored user data
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data.user)
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Get user failed',
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
   * Get stored user data from local storage
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