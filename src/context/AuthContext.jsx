import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState('Customer'); // Customer | Delivery Partner | Admin
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setActiveRole(currentUser.role || 'Customer');
        }
        const userAddresses = await userApi.getAddresses();
        setAddresses(userAddresses);
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      setUser(res.user);
      setActiveRole(res.user.role || 'Customer');
      addToast(`Welcome back, ${res.user.name}!`);
      return res;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      setUser(res.user);
      setActiveRole(res.user.role || 'Customer');
      addToast('Account created successfully!');
      return res;
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setActiveRole('Customer');
    addToast('Logged out successfully', 'info');
  };

  // 1-click role switcher for seamless evaluation
  const switchRole = (role) => {
    setActiveRole(role);
    addToast(`Switched active view to: ${role}`, 'info');
  };

  const addAddress = async (newAddressData) => {
    try {
      const saved = await userApi.addAddress(newAddressData);
      setAddresses(await userApi.getAddresses());
      addToast('Address added successfully!');
      return saved;
    } catch (err) {
      addToast('Failed to add address', 'error');
      throw err;
    }
  };

  const removeAddress = async (id) => {
    try {
      await userApi.deleteAddress(id);
      setAddresses(await userApi.getAddresses());
      addToast('Address removed', 'info');
    } catch (err) {
      addToast('Failed to remove address', 'error');
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const updated = await userApi.setDefaultAddress(id);
      setAddresses(updated);
      addToast('Default delivery address updated');
    } catch (err) {
      addToast('Failed to update default address', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        switchRole,
        login,
        register,
        logout,
        addresses,
        addAddress,
        removeAddress,
        setDefaultAddress,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
