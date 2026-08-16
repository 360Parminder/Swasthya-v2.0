import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Image, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  UserIcon, 
  SmartPhone01Icon, 
  Mail01Icon, 
  LockKeyIcon, 
  Tick02Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  ViewIcon,
  ViewOffSlashIcon
} from '@hugeicons/core-free-icons';
import { GoogleIcon } from '../../components/common/SocialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { RulerPickerCard, DateWheelPickerCard } from '../../components/common/HealthPickers';

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
    watch
  } = useForm({ 
    mode: 'onChange',
    defaultValues: {
      name: '',
      gender: 'Male',
      dob: '2000-01-15',
      food: 'Vegetarian',
      weight: '70',
      height: '175',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  // Smooth transition on step change
  useEffect(() => {
    slideAnim.setValue(20);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      })
    ]).start();
  }, [step, fadeAnim, slideAnim]);

  const next = async () => {
    if (step === 2) {
      const isValid = await trigger(['name', 'gender', 'dob']);
      if (!isValid) return;
    } else if (step === 3) {
      const isValid = await trigger(['food', 'weight', 'height']);
      if (!isValid) return;
    } else if (step === 4) {
      const isValid = await trigger(['mobile', 'email']);
      if (!isValid) return;
    }
    setStep((s) => s + 1);
  };

  const prev = () => {
    setStep((s) => s - 1);
  };

  const submit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        food: formData.food,
        weight: Number(formData.weight) || formData.weight,
        height: Number(formData.height) || formData.height,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        weightUnit,
        heightUnit,
      };

      if (registerUser) {
        await registerUser(payload);
      }
      Toast.show({
        type: 'success',
        text1: 'Welcome to Swasthya! 🎉',
        text2: 'Your account has been created successfully.',
      });
      navigation.navigate('SignIn');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];

  // Chip Selector Component
  const ChipGroup = ({ label, options, value, onSelect, error }) => (
    <View style={styles.fieldContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              onPress={() => onSelect(option)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  // STEP 1: Full-Bleed Onboarding matching reference image
  if (step === 1) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Fullscreen Background */}
        <Image
          source={require('../../../assets/images/onboarding_bg.jpg')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />

        {/* Smooth Dark Gradient into Pitch Black */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', '#000000', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.38, 0.6, 1]}
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
        />

        {/* Foreground Content */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 24,
            paddingBottom: Math.max(insets.bottom, 24),
            zIndex: 10,
            elevation: 10,
          }}
        >
          {/* Carousel Indicator */}
          <View style={styles.carouselIndicators}>
            <View style={styles.indicatorActive} />
            <View style={styles.indicatorInactive} />
            <View style={styles.indicatorInactive} />
          </View>

          {/* Main Headline */}
          <Text style={styles.heroHeadline}>
            {'Smart Health\nfor Everyday\nLiving'}
          </Text>

          {/* Continue with Google */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.googleButton}
            onPress={next}
          >
            <GoogleIcon size={20} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Continue with Email */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.emailButton}
            onPress={next}
          >
            <HugeiconsIcon icon={Mail01Icon} size={20} color="#FFFFFF" />
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          </TouchableOpacity>

          {/* Footer Login Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // STEPS 2 to 5: High-End Dark Registration Wizard
  const currentFormStep = step - 1; // 1 to 4

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
          {/* Top Navigation Bar */}
          <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 12) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={prev}
              style={styles.navBackButton}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Segmented Progress Bar */}
            <View style={styles.progressSegmentsContainer}>
              {[1, 2, 3, 4].map((seg) => (
                <View
                  key={seg}
                  style={[
                    styles.progressSegment,
                    seg <= currentFormStep ? styles.progressSegmentActive : styles.progressSegmentInactive
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('SignIn')}
              style={styles.navLoginLink}
            >
              <Text style={styles.navLoginText}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Main Scrollable Form Content */}
          <ScrollView 
            style={styles.scrollContent} 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              {/* Step 2: Personal Details */}
              {step === 2 && (
                <View>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 1 OF 4</Text>
                  </View>
                  <Text style={styles.stepTitle}>Personal Details</Text>
                  <Text style={styles.stepSubtitle}>Tell us a bit about yourself to personalize your health metrics.</Text>

                  {/* Full Name */}
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Full name is required' }}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={[styles.inputWrapper, errors.name && styles.errorBorder]}>
                          <HugeiconsIcon icon={UserIcon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                          <TextInput
                            style={styles.textInput}
                            placeholder="Enter your full name"
                            placeholderTextColor="#71717A"
                            onChangeText={onChange}
                            value={value}
                          />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                      </View>
                    )}
                  />

                  {/* Gender Chips */}
                  <Controller
                    control={control}
                    name="gender"
                    rules={{ required: 'Please select a gender' }}
                    render={({ field: { onChange, value } }) => (
                      <ChipGroup
                        label="Gender"
                        options={genderOptions}
                        value={value}
                        onSelect={onChange}
                        error={errors.gender?.message}
                      />
                    )}
                  />

                  {/* Date of Birth Wheel Picker */}
                  <Controller
                    control={control}
                    name="dob"
                    rules={{ required: 'Date of birth is required' }}
                    render={({ field: { onChange, value } }) => (
                      <DateWheelPickerCard
                        title="Date of Birth"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}
                </View>
              )}

              {/* Step 3: Body & Food Details */}
              {step === 3 && (
                <View>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 2 OF 4</Text>
                  </View>
                  <Text style={styles.stepTitle}>Body & Nutrition</Text>
                  <Text style={styles.stepSubtitle}>Enter your physical stats to calculate calories and hydration targets.</Text>

                  {/* Food Preference Chips */}
                  <Controller
                    control={control}
                    name="food"
                    rules={{ required: 'Please select diet preference' }}
                    render={({ field: { onChange, value } }) => (
                      <ChipGroup
                        label="Dietary Preference"
                        options={foodOptions}
                        value={value}
                        onSelect={onChange}
                        error={errors.food?.message}
                      />
                    )}
                  />

                  {/* Weight Ruler Picker */}
                  <Controller
                    control={control}
                    name="weight"
                    rules={{ required: 'Weight is required' }}
                    render={({ field: { onChange, value } }) => (
                      <RulerPickerCard
                        title="Weight"
                        min={30}
                        max={180}
                        value={Number(value) || 70}
                        onChange={(val) => onChange(String(val))}
                        unit="kg"
                        units={['kg', 'lbs']}
                        selectedUnit={weightUnit}
                        onUnitChange={setWeightUnit}
                      />
                    )}
                  />
                  {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}

                  {/* Height Ruler Picker */}
                  <Controller
                    control={control}
                    name="height"
                    rules={{ required: 'Height is required' }}
                    render={({ field: { onChange, value } }) => (
                      <RulerPickerCard
                        title="Height"
                        min={100}
                        max={230}
                        value={Number(value) || 175}
                        onChange={(val) => onChange(String(val))}
                        unit="cm"
                        units={['cm', 'ft']}
                        selectedUnit={heightUnit}
                        onUnitChange={setHeightUnit}
                      />
                    )}
                  />
                  {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
                </View>
              )}

              {/* Step 4: Contact Information */}
              {step === 4 && (
                <View>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 3 OF 4</Text>
                  </View>
                  <Text style={styles.stepTitle}>Contact Details</Text>
                  <Text style={styles.stepSubtitle}>We will use this information to verify and protect your account.</Text>

                  {/* Mobile Number */}
                  <Controller
                    control={control}
                    name="mobile"
                    rules={{ 
                      required: 'Mobile number is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={[styles.inputWrapper, errors.mobile && styles.errorBorder]}>
                          <HugeiconsIcon icon={SmartPhone01Icon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                          <TextInput
                            style={styles.textInput}
                            placeholder="10-digit mobile number"
                            placeholderTextColor="#71717A"
                            keyboardType="phone-pad"
                            onChangeText={onChange}
                            value={value}
                            maxLength={10}
                          />
                        </View>
                        {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}
                      </View>
                    )}
                  />

                  {/* Email */}
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: 'Email address is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email address'
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[styles.inputWrapper, errors.email && styles.errorBorder]}>
                          <HugeiconsIcon icon={Mail01Icon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                          <TextInput
                            style={styles.textInput}
                            placeholder="name@example.com"
                            placeholderTextColor="#71717A"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            value={value}
                          />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Step 5: Set Password */}
              {step === 5 && (
                <View>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>STEP 4 OF 4</Text>
                  </View>
                  <Text style={styles.stepTitle}>Set Password</Text>
                  <Text style={styles.stepSubtitle}>Create a secure password to keep your health data private.</Text>

                  {/* Password */}
                  <Controller
                    control={control}
                    name="password"
                    rules={{ 
                      required: 'Password is required', 
                      minLength: { value: 6, message: 'Minimum 6 characters' } 
                    }}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.inputWrapper, errors.password && styles.errorBorder]}>
                          <HugeiconsIcon icon={LockKeyIcon} size={20} color="#A1A1AA" style={styles.fieldIcon} />
                          <TextInput
                            style={styles.textInput}
                            placeholder="At least 6 characters"
                            placeholderTextColor="#71717A"
                            secureTextEntry={!showPassword}
                            onChangeText={onChange}
                            value={value}
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
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                      </View>
                    )}
                  />

                  {/* Confirm Password */}
                  <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: 'Please confirm password',
                      validate: value => value === getValues('password') || 'Passwords do not match'
                    }}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword && styles.errorBorder]}>
                          <HugeiconsIcon 
                            icon={Tick02Icon} 
                            size={20} 
                            color={passwordVal && value && passwordVal === value ? '#10B981' : '#A1A1AA'} 
                            style={styles.fieldIcon} 
                          />
                          <TextInput
                            style={styles.textInput}
                            placeholder="Re-enter your password"
                            placeholderTextColor="#71717A"
                            secureTextEntry={!showConfirmPassword}
                            onChangeText={onChange}
                            value={value}
                          />
                          <TouchableOpacity 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.passwordToggle}
                          >
                            <HugeiconsIcon 
                              icon={showConfirmPassword ? ViewOffSlashIcon : ViewIcon} 
                              size={20} 
                              color="#A1A1AA" 
                            />
                          </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                      </View>
                    )}
                  />
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {step < 5 ? (
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.primaryActionButton}
                onPress={next}
              >
                <Text style={styles.primaryActionText}>Continue</Text>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#000000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.primaryActionButton}
                onPress={handleSubmit(submit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <>
                    <Text style={styles.primaryActionText}>Create Account</Text>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#000000" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;

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
    height: 180,
  },
  // Top Navigation
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
  progressSegmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: '#FFFFFF',
  },
  progressSegmentInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  navLoginLink: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navLoginText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  // Form Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  stepBadgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  stepSubtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
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
  dateText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#71717A',
  },
  unitBadge: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  passwordToggle: {
    padding: 6,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  // Chip Selectors
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#FFFFFF',
  },
  chipUnselected: {
    backgroundColor: '#121217',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipText: {
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#000000',
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: '#A1A1AA',
    fontWeight: '500',
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  // Bottom Action Bar
  bottomActionBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  primaryActionButton: {
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
  },
  primaryActionText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  // Onboarding Step 1 Styles
  carouselIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  indicatorActive: {
    width: 26,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  indicatorInactive: {
    width: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.6,
    marginBottom: 28,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonText: {
    color: '#090A0F',
    fontSize: 16,
    fontWeight: '700',
  },
  emailButton: {
    backgroundColor: '#141418',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
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
