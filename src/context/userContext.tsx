import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

export interface User {
  userName: string | undefined;
  videoFilter: {
    filterName: string;
    filterPayload: string;
  };
  defaultSettings: {
    publishAudio: boolean | undefined;
    publishVideo: boolean | undefined;
    audioSource: string | undefined;
    videoSource: string | undefined;
    audioOutput: string | undefined;
  };
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({
  children,
}: UserContextProviderProps): ReactNode => {
  const [user, setUser] = useState<User | null>(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
};

// Custom hook for UserContext usage
export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
};
