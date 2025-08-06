import React, { createContext, useContext, useState, ReactNode } from 'react';

type MyAppContextType = {
  username: string;
  setUsername: (name: string) => void;
};

const MyAppContext = createContext<MyAppContextType | undefined>(undefined);

export const MyAppProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('زائر');

  return (
    <MyAppContext.Provider value={{ username, setUsername }}>
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