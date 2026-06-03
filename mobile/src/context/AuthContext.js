import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Rahul Verma',
  age: 27,
  gender: 'MALE',
  bio: 'Startup founder | Fitness freak | Foodie | Looking for something real',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  ],
  interests: ['Fitness', 'Startups', 'Food', 'Movies', 'Cricket', 'Travel'],
  city: 'New Delhi',
  phone: '+919876543211',
  isVerified: true,
  isActive: true,
  profileApproved: true,
  minAgePreference: 20,
  maxAgePreference: 30,
  maxDistance: 50,
  genderPreference: 'FEMALE',
  latitude: 28.6139,
  longitude: 77.2090,
};

export const AuthProvider = ({ children }) => {
  // Auto-login with demo user for preview
  const [user, setUser] = useState(DEMO_USER);
  const [token, setToken] = useState('demo-token');
  const [loading, setLoading] = useState(false);

  const login = async (phone) => {
    setUser(DEMO_USER);
    setToken('demo-token');
    return DEMO_USER;
  };

  const register = async (userData) => {
    const newUser = { ...DEMO_USER, ...userData, id: 'new-user' };
    setUser(newUser);
    setToken('demo-token');
    return newUser;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    // Re-login for demo after 1 sec
    setTimeout(() => {
      setUser(DEMO_USER);
      setToken('demo-token');
    }, 1000);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
