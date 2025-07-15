import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    authenticated: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  console.log('AuthProvider initialized with state:', authState);
  
  useEffect(() => {
    const loadToken = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        console.log('Credentials loaded:', credentials);
        if (credentials) {
          const response = await authApi.getUser(); // Fetch user data if needed
          setAuthState({
            token: credentials.password,
            user: response.data.user,
            authenticated: true,
          });
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (mobile, password) => {
    try {
      const response = await authApi.login(mobile, password);
      // console.log('Login response:', response);
      
      setAuthState({
        token: response.data.token,
        user: response.data.user,
        authenticated: true,
      });
      await Keychain.setGenericPassword('token', response.data.token);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await authApi.register({ email, password, name });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      await Keychain.resetGenericPassword();
      setAuthState({
        token: null,
        user: null,
        authenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);