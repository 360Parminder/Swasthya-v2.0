import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { authApi } from '../api/authApi';
import { notificationService } from '../services/notificationService';

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
          // Sync FCM push token with backend
          notificationService.syncFcmToken();
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (mobile, password) => {
    setIsLoading(true);
    try {
      const fcmToken = await notificationService.getDeviceToken();
      const response = await authApi.login(mobile, password, fcmToken);
      console.log('Login response:', response);

      setAuthState({
        token: response.data.token,
        user: response.data.user,
        authenticated: true,
      });
      await Keychain.setGenericPassword('token', response.data.token);
      notificationService.syncFcmToken();
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  const register = async (userDataOrEmail, password, name) => {
    try {
      const fcmToken = await notificationService.getDeviceToken();
      const payload = typeof userDataOrEmail === 'object' 
        ? { ...userDataOrEmail, fcm_token: fcmToken, notificationToken: fcmToken } 
        : { email: userDataOrEmail, password, name, fcm_token: fcmToken, notificationToken: fcmToken };
      const response = await authApi.register(payload);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const googleLogin = async (googleData) => {
    setIsLoading(true);
    try {
      const fcmToken = await notificationService.getDeviceToken();
      const response = await authApi.googleAuth({ ...googleData, fcm_token: fcmToken });
      console.log('Google Auth response:', response?.data);

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (token) {
        setAuthState({
          token,
          user,
          authenticated: true,
        });
        await Keychain.setGenericPassword('token', token);
        notificationService.syncFcmToken();
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    try {
      // await authApi.logout();
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
        googleLogin,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);