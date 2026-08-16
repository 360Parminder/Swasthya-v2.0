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
  ScrollView
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
      await login(data.mobile, data.password);
      showToast('success', 'Welcome back! 👋');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Subtle top ambient glow */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.12)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientTopGlow}
        pointerEvents="none"
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          {/* Top Bar */}
          <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 12) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SignUp')}
              style={styles.navBackButton}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              style={styles.navLink}
            >
              <Text style={styles.navLinkText}>Sign Up</Text>
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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>WELCOME BACK</Text>
            </View>
            <Text style={styles.title}>{'Sign In to\nSwasthya'}</Text>
            <Text style={styles.subtitle}>
              Enter your registered mobile number and password to access your dashboard.
            </Text>

            {/* Mobile Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <HugeiconsIcon icon={SmartPhone01Icon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#71717A"
                  keyboardType="phone-pad"
                  value={data.mobile}
                  onChangeText={(text) => setData({ ...data, mobile: text })}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <HugeiconsIcon icon={LockKeyIcon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#71717A"
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
                    color="#A1A1AA" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Primary Login Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onSubmit}
              disabled={isLoading}
              style={[styles.primaryButton, isLoading && { opacity: 0.8 }]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#000000" />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity 
              activeOpacity={0.88}
              style={styles.googleFullButton}
              onPress={() => showToast('info', 'Google Sign In', 'Connecting to Google services...')}
            >
              <GoogleIcon size={20} />
              <Text style={styles.googleFullButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer Sign Up Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Sign Up</Text>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: '#121217',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLink: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navLinkText: {
    color: '#A1A1AA',
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
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  badgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121217',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    paddingHorizontal: 16,
  },
  fieldIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
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
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#000000',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  googleFullButton: {
    backgroundColor: '#121217',
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  googleFullButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
    fontWeight: '500',
  },
  footerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});