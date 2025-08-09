import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
};

const MyAppContext = createContext<MyAppContextType | undefined>(undefined);

const ONBOARDING_KEY = 'hasCompletedOnboarding';
const LOGIN_KEY = 'hasCompletedLogin';

export const MyAppProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('زائر');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedLogin, setHasCompletedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always start fresh - don't load previous state
  useEffect(() => {
    console.log('📱 Starting fresh - not loading previous state');
    // Always start with fresh state
    setHasCompletedOnboarding(false);
    setHasCompletedLogin(false);
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
      isLoading
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