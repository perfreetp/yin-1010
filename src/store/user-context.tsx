import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface UserContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
}

const defaultUser: User = {
  id: 'u001',
  name: '张建国',
  phone: '138****1234',
  role: 'vendor'
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  const setRole = (role: UserRole) => {
    const users: Record<UserRole, User> = {
      vendor: { id: 'u001', name: '张建国', phone: '138****1234', role: 'vendor' },
      admin: { id: 'u002', name: '管理员王', phone: '136****0001', role: 'admin' },
      patrol: { id: 'u003', name: '李巡查', phone: '135****0002', role: 'patrol' }
    };
    setCurrentUser(users[role]);
    console.log('[UserContext] 切换角色:', role, users[role]);
  };

  return (
    <UserContext.Provider value={{ currentUser, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
