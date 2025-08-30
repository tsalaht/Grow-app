import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.log('🔐 Request with token:', config.method?.toUpperCase(), config.url);
      } else {
        console.log('⚠️ Request without token:', config.method?.toUpperCase(), config.url);
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
    console.log('✅ Response success:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const url = error.config?.url || '';
    const status = error.response?.status;
    
    console.log(`❌ Response error: ${status} ${error.message}`, url);
    
    // Only handle 401 for specific endpoints that should trigger logout
    // For other endpoints, let the calling code handle the error
    if (status === 401) {
      // Only auto-logout for authentication-related endpoints
      const authEndpoints = ['/get-user', '/profile', '/logout'];
      const shouldAutoLogout = authEndpoints.some(endpoint => url.includes(endpoint));
      
      if (shouldAutoLogout) {
        try {
          console.log('🔐 Auto-logout due to 401 on auth endpoint:', url);
          // Remove token from storage
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          
          // Note: Don't redirect here, let the context handle it
          // The context will detect the missing token and update state accordingly
        } catch (storageError) {
          console.error('Error clearing storage:', storageError);
        }
      } else {
        console.log('⚠️ 401 response on non-auth endpoint, not auto-logging out:', url);
      }
    } else if (status === 404) {
      console.log('🔍 404 Not Found - Endpoint may not exist:', url);
    } else if (status >= 500) {
      console.log('🚨 Server error:', status, url);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
