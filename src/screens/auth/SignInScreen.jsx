import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  ScrollView,
  useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  SmartPhone01Icon, 
  LockKeyIcon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  ViewIcon,
  ViewOffSlashIcon
} from '@hugeicons/core-free-icons';
import { GoogleIcon } from '../../components/common/SocialIcons';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

const SignInScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const { login, isLoading } = useAuth();
  
  const [data, setData] = useState({
    mobile: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async () => {
    if (!data.mobile || !data.password) {
      showToast('info', 'Please fill in all fields');
      return;
    }

    try {
      await login(data.mobile.trim(), data.password);
      showToast('success', 'Welcome back! 👋');
    } catch (error) {
      showToast('error', error.response?.data?.message || error.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <View style={[styles.mainContainer, theme.mainContainer]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#000000' : '#F9FAFB'} 
      />

      {/* Subtle top ambient glow */}
      <LinearGradient
        colors={isDark ? ['rgba(59, 130, 246, 0.12)', 'transparent'] : ['rgba(59, 130, 246, 0.06)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientTopGlow}
        pointerEvents="none"
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <View style={styles.flexOne}>
          {/* Top Bar */}
          <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 12) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SignUp')}
              style={[styles.navBackButton, theme.navBackButton]}
            >
              <HugeiconsIcon 
                icon={ArrowLeft01Icon} 
                size={22} 
                color={isDark ? '#FFFFFF' : '#111827'} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              style={styles.navLink}
            >
              <Text style={[styles.navLinkText, theme.navLinkText]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Main Scroll Content */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Badge & Title */}
            <View style={[styles.badge, theme.badge]}>
              <Text style={[styles.badgeText, theme.badgeText]}>WELCOME BACK</Text>
            </View>
            <Text style={[styles.title, theme.title]}>{'Sign In to\nSwasthya'}</Text>
            <Text style={[styles.subtitle, theme.subtitle]}>
              Enter your registered mobile number and password to access your dashboard.
            </Text>

            {/* Mobile Input */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, theme.label]}>Mobile Number</Text>
              <View style={[styles.inputWrapper, theme.inputWrapper]}>
                <HugeiconsIcon 
                  icon={SmartPhone01Icon} 
                  size={20} 
                  color={isDark ? '#A1A1AA' : '#6B7280'} 
                  style={styles.fieldIcon} 
                />
                <TextInput
                  style={[styles.textInput, theme.textInput]}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                  keyboardType="phone-pad"
                  value={data.mobile}
                  onChangeText={(text) => setData({ ...data, mobile: text })}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, theme.label]}>Password</Text>
              <View style={[styles.inputWrapper, theme.inputWrapper]}>
                <HugeiconsIcon 
                  icon={LockKeyIcon} 
                  size={20} 
                  color={isDark ? '#A1A1AA' : '#6B7280'} 
                  style={styles.fieldIcon} 
                />
                <TextInput
                  style={[styles.textInput, theme.textInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                  secureTextEntry={!showPassword}
                  value={data.password}
                  onChangeText={(text) => setData({ ...data, password: text })}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <HugeiconsIcon 
                    icon={showPassword ? ViewOffSlashIcon : ViewIcon} 
                    size={20} 
                    color={isDark ? '#A1A1AA' : '#6B7280'} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={[styles.forgotPasswordText, theme.forgotPasswordText]}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Primary Login Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onSubmit}
              disabled={isLoading}
              style={[styles.primaryButton, theme.primaryButton, isLoading && { opacity: 0.8 }]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={isDark ? '#000000' : '#FFFFFF'} />
              ) : (
                <>
                  <Text style={[styles.primaryButtonText, theme.primaryButtonText]}>Sign In</Text>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={isDark ? '#000000' : '#FFFFFF'} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, theme.dividerLine]} />
              <Text style={[styles.dividerText, theme.dividerText]}>OR CONTINUE WITH</Text>
              <View style={[styles.dividerLine, theme.dividerLine]} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity 
              activeOpacity={0.88}
              style={[styles.googleFullButton, theme.googleFullButton]}
              onPress={() => showToast('info', 'Google Sign In', 'Connecting to Google services...')}
            >
              <GoogleIcon size={20} />
              <Text style={[styles.googleFullButtonText, theme.googleFullButtonText]}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer Sign Up Link */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, theme.footerText]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={[styles.footerLink, theme.footerLink]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  navBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLink: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 56,
    paddingHorizontal: 16,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
    paddingLeft: 6,
  },
  passwordToggle: {
    padding: 6,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -6,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  googleFullButton: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  googleFullButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

// Dark Theme Variants
const darkTheme = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#000000',
  },
  navBackButton: {
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  navLinkText: {
    color: '#A1A1AA',
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  badgeText: {
    color: '#93C5FD',
  },
  title: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  label: {
    color: '#E4E4E7',
  },
  inputWrapper: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    color: '#FFFFFF',
  },
  forgotPasswordText: {
    color: '#93C5FD',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.15,
  },
  primaryButtonText: {
    color: '#000000',
  },
  dividerLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#71717A',
  },
  googleFullButton: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  googleFullButtonText: {
    color: '#FFFFFF',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  footerLink: {
    color: '#FFFFFF',
  },
});

// Light Theme Variants
const lightTheme = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F9FAFB',
  },
  navBackButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navLinkText: {
    color: '#4B5563',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  badgeText: {
    color: '#2563EB',
  },
  title: {
    color: '#111827',
  },
  subtitle: {
    color: '#4B5563',
  },
  label: {
    color: '#374151',
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  textInput: {
    color: '#111827',
  },
  forgotPasswordText: {
    color: '#2563EB',
  },
  primaryButton: {
    backgroundColor: '#111827',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  dividerLine: {
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
  },
  googleFullButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  googleFullButtonText: {
    color: '#111827',
  },
  footerText: {
    color: '#6B7280',
  },
  footerLink: {
    color: '#111827',
  },
});