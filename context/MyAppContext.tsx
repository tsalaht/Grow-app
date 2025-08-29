import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthApi } from '../services/api';

type MyAppContextType = {
  username: string;
  setUsername: (name: string) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  hasCompletedLogin: boolean;
  setHasCompletedLogin: (completed: boolean) => void;
  resetAppState: () => Promise<void>;
  forceResetToOnboarding: () => Promise<void>;
  isLoading: boolean;
  // New authentication properties
  isAuthenticated: boolean;
  userData: any;
  login: (email: string, password: string, fcmToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

const MyAppContext = createContext<MyAppContextType | undefined>(undefined);

const ONBOARDING_KEY = 'hasCompletedOnboarding';
const LOGIN_KEY = 'hasCompletedLogin';

export const MyAppProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('زائر');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedLogin, setHasCompletedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // New authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await AuthApi.isAuthenticated();
      const user = await AuthApi.getUserData();
      
      setIsAuthenticated(authenticated);
      setUserData(user);
      
      if (authenticated && user) {
        setUsername(user.name || 'زائر');
        setHasCompletedLogin(true);
      }
      
      console.log('🔐 Auth status checked:', { authenticated, user });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string, fcmToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await AuthApi.login({ email, password, fcmToken });
      
      console.log('API login response in context:', result); // Debug log

      if (result.token) { // Check for token at root level
        setIsAuthenticated(true);
        setUserData(result.data?.user); // Access user from result.data?.user
        setUsername(result.data?.user?.name || 'زائر'); // Set username from result.data.user.name
        setHasCompletedLogin(true);
        console.log('✅ Login successful:', result.data?.user);

        // Update userData and username based on response
        if (result.data && result.data.user) {
          setUserData({ ...result.data.user, name: result.data.user.name });
          setUsername(result.data.user.name);
        }

        return true;
      } else {
        console.error('❌ Login failed:', result.error || 'No token received');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthApi.logout();
      setIsAuthenticated(false);
      setUserData(null);
      setUsername('زائر');
      setHasCompletedLogin(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Always start fresh - don't load previous state
  useEffect(() => {
    console.log('📱 Starting fresh - not loading previous state');
    // Always start with fresh state
    setHasCompletedOnboarding(false);
    // Note: We don't reset login state here anymore as it's handled by checkAuthStatus
    setIsLoading(false);
  }, []);

  // Set onboarding state (session only - no persistence)
  const handleSetHasCompletedOnboarding = (completed: boolean) => {
    setHasCompletedOnboarding(completed);
    console.log('📝 Set onboarding state (session only):', completed);
  };

  // Set login state (session only - no persistence)
  const handleSetHasCompletedLogin = (completed: boolean) => {
    setHasCompletedLogin(completed);
    console.log('📝 Set login state (session only):', completed);
  };

  // Reset all app state (for testing)
  const resetAppState = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ONBOARDING_KEY),
        AsyncStorage.removeItem(LOGIN_KEY)
      ]);
      setHasCompletedOnboarding(false);
      setHasCompletedLogin(false);
      setIsAuthenticated(false);
      setUserData(null);
      setUsername('زائر');
      console.log('🔄 Reset app state completed');
    } catch (error) {
      console.error('Error resetting app state:', error);
    }
  };

  // Force reset to onboarding (immediate reset)
  const forceResetToOnboarding = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ONBOARDING_KEY),
        AsyncStorage.removeItem(LOGIN_KEY)
      ]);
      setHasCompletedOnboarding(false);
      setHasCompletedLogin(false);
      setIsAuthenticated(false);
      setUserData(null);
      setUsername('زائر');
      setIsLoading(false);
      console.log('🚀 Force reset to onboarding completed');
    } catch (error) {
      console.error('Error force resetting to onboarding:', error);
    }
  };

  return (
    <MyAppContext.Provider value={{ 
      username, 
      setUsername, 
      hasCompletedOnboarding, 
      setHasCompletedOnboarding: handleSetHasCompletedOnboarding,
      hasCompletedLogin,
      setHasCompletedLogin: handleSetHasCompletedLogin,
      resetAppState,
      forceResetToOnboarding,
      isLoading,
      // New authentication properties
      isAuthenticated,
      userData,
      login,
      logout,
      checkAuthStatus,
    }}>
      {children}
    </MyAppContext.Provider>
  );
};

export const useMyAppContext = () => {
  const context = useContext(MyAppContext);
  if (!context) {
    throw new Error('useMyAppContext يجب أن يُستخدم داخل MyAppProvider');
  }
  return context;
};