import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu cho thông tin người dùng
interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
}

// Định nghĩa kiểu cho giá trị của context
interface UserContextType {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined); // Cung cấp giá trị mặc định là undefined

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider'); // Thông báo lỗi nếu context không có trong provider
  }
  return context;
};
