import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useThemeColors } from '../../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CallIcon, LockKeyIcon } from '@hugeicons/core-free-icons';

const SignInScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const COLORS = useThemeColors();
  const styles = useMemo(() => getStyles(COLORS), [COLORS]);
  
  const [data, setData] = useState({
    mobile: '',
    password: '',
  });

  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 10,
    });
  };

  const onSubmit = async (data) => {
    if (data.mobile && data.password) {
      try {
        await login(data.mobile, data.password);
        showToast('success', 'Welcome back!');
      } catch (error) {
        showToast('error', error.response?.data?.message || 'An error occurred');

      }
    } else {
      showToast('info', 'Please fill in all fields');
    }
  };

  return (

    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
      >
      <View style={{ marginBottom: 20, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{ width: 50, height: 50, alignSelf: 'center', marginVertical: 20 }}
        // resizeMode="contain"
        />
        <Text style={{ color: COLORS.text, fontSize: 34, fontWeight: 'bold' }}>Sign in your</Text>
        <Text style={{ color: COLORS.text, fontSize: 34, fontWeight: 'bold' }}>Account</Text>
        <View style={styles.topContainer}>
          <Text style={{ color: COLORS.text, fontSize: 16 }}>Don`t have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={{ color: COLORS.accent, fontSize: 16, }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '100%', paddingHorizontal: 20 }}>
        <View style={styles.inputContainerTop}>
          <HugeiconsIcon icon={CallIcon} size={20} color={COLORS.primary} />
          <TextInput onChangeText={(text) => setData({ ...data, mobile: text })} placeholder='877911****' placeholderTextColor={COLORS.placeholder} keyboardType='phone-pad' style={styles.input} />
        </View>
        <View style={styles.inputContainerBottom}>
          <HugeiconsIcon icon={LockKeyIcon} size={20} color={COLORS.primary} />
          <TextInput onChangeText={(text) => setData({ ...data, password: text })} placeholder='********' secureTextEntry={true} placeholderTextColor={COLORS.placeholder} style={styles.input} />
        </View>
      </View>
      <TouchableOpacity>
        <Text style={{ marginTop: 10, color: COLORS.text, fontSize: 14, fontWeight: '600', alignSelf: 'flex-end', marginRight: 20, textDecorationLine: 'underline' }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSubmit(data)}
        disabled={isLoading}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: isLoading ? COLORS.primary + '80' : COLORS.primary,
          borderRadius: 10,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoading ? 0.8 : 1,
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.buttonText || '#FFFFFF'} />
        ) : (
          <Text style={{ color: COLORS.buttonText || '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
            Login
          </Text>
        )}
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  topContainer: {
    marginTop: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 5,
  },
  formContainer: {
    padding: 20,
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '65%',
    marginBottom: 0, 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    fontSize: 60,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainerTop: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.inputBackground, 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10, 
    paddingHorizontal: 10, 
    height: 50, 
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  inputContainerBottom: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.inputBackground, 
    borderBottomRightRadius: 10, 
    borderBottomLeftRadius: 10, 
    paddingHorizontal: 10, 
    height: 50, 
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    flex: 1, 
    paddingLeft: 10, 
    color: COLORS.inputText || COLORS.text, 
    height: '100%' 
  }
});