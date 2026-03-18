import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useThemeColors } from '../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SignInScreen = ({ navigation }) => {
  const { login } = useAuth();
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);
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
      topOffset: 50,
    });
  };

  const onSubmit = async (data) => {
    if (data.mobile && data.password) {
      setIsLoading(true);
      try {
        await login(data.mobile, data.password);
        showToast('success', 'Welcome back!');
      } catch (error) {
        showToast('error', error.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast('info', 'Please fill in all fields');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Welcome back to Swasthya</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.cardBackground, shadowColor: colors.text }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Mobile Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <Icon name="call-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput 
                  onChangeText={(text) => setData({ ...data, mobile: text })} 
                  placeholder='Enter mobile number' 
                  placeholderTextColor={colors.placeholder} 
                  keyboardType='phone-pad' 
                  style={[styles.input, { color: colors.inputText }]} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                <Icon name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput 
                  onChangeText={(text) => setData({ ...data, password: text })} 
                  placeholder='Enter password' 
                  secureTextEntry={true} 
                  placeholderTextColor={colors.placeholder} 
                  style={[styles.input, { color: colors.inputText }]} 
                />
              </View>
              <TouchableOpacity>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              disabled={isLoading} 
              onPress={() => onSubmit(data)} 
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.buttonText} size="small" />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                    Login
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '700', marginLeft: 6 }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  formCard: {
    padding: 24,
    borderRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  buttonGradient: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
