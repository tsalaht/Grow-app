import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.growupe.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        // Remove token from storage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');
        
        // Redirect to login
        router.replace('/login');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
