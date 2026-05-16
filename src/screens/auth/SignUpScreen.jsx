import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Image, 
  Dimensions, 
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../../components/common/Input';
import { useThemeColors } from '../../components/ui/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const SignUpScreen = ({ navigation }) => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [dropdownOpen, setDropdownOpen] = useState({
    gender: false,
    food: false
  });
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue
  } = useForm({ mode: 'onChange' });
  
  // Animate in on step change
  useEffect(() => {
    slideAnim.setValue(SCREEN_HEIGHT);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  const submit = (data) => {
    // Handle signup logic
    // navigation.navigate('SignIn');
    console.log('Form submitted:', data);
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const foodOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];

  // Dropdown Component
  const DropdownField = ({ label, options, value, onSelect, error }) => (
    <View style={styles.fieldContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.dropdownButton, error && styles.errorInput]}
        onPress={() => setDropdownOpen(prev => ({ ...prev, [label.toLowerCase()]: !prev[label.toLowerCase()] }))}
      >
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
          {value || `Select ${label}`}
        </Text>
        <Icon name="chevron-down" size={20} color={COLORS.text} />
      </TouchableOpacity>
      {dropdownOpen[label.toLowerCase()] && (
        <View style={styles.dropdownOptionsContainer}>
          {options.map((option, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setDropdownOpen(prev => ({ ...prev, [label.toLowerCase()]: false }));
              }}
            >
              <Text style={[styles.dropdownOptionText, value === option && styles.selectedOption]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  // Date Picker Component (Simple)
  const DatePickerField = ({ label, value, onDateSelect, error }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

    const handleDateChange = (date) => {
      setTempDate(date);
    };

    const confirmDate = () => {
      const dateString = tempDate.toISOString().split('T')[0];
      onDateSelect(dateString);
      setShowPicker(false);
    };

    return (
      <View style={styles.fieldContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity 
          style={[styles.dateButton, error && styles.errorInput]}
          onPress={() => setShowPicker(true)}
        >
          <Icon name="calendar-outline" size={20} color={COLORS.primary} style={styles.dateIcon} />
          <Text style={[styles.dateButtonText, !value && styles.placeholderText]}>
            {value || 'Select Date (YYYY-MM-DD)'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <View style={styles.dateInputRow}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY"
                  value={String(tempDate.getFullYear())}
                  onChangeText={(val) => {
                    const newDate = new Date(tempDate);
                    newDate.setFullYear(parseInt(val) || new Date().getFullYear());
                    handleDateChange(newDate);
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM"
                  value={String(tempDate.getMonth() + 1).padStart(2, '0')}
                  onChangeText={(val) => {
                    const newDate = new Date(tempDate);
                    newDate.setMonth(Math.min(Math.max(parseInt(val) - 1, 0), 11));
                    handleDateChange(newDate);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD"
                  value={String(tempDate.getDate()).padStart(2, '0')}
                  onChangeText={(val) => {
                    const newDate = new Date(tempDate);
                    newDate.setDate(Math.min(Math.max(parseInt(val), 1), 31));
                    handleDateChange(newDate);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={styles.dateModalButtonRow}>
                <TouchableOpacity 
                  style={[styles.dateModalButton, styles.cancelButton]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.dateModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dateModalButton, styles.confirmButton]}
                  onPress={confirmDate}
                >
                  <Text style={[styles.dateModalButtonText, { color: '#fff' }]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  const StepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Image
              source={require('../../../assets/images/welcome.png')}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Swasthya</Text>
            <Text style={styles.subtitle}>Your journey towards better health begins here!</Text>
            <TouchableOpacity onPress={next} style={{ marginTop: 30 }}>
              <LinearGradient colors={['#8b5cf6', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.getStartedBtn}>
                <Text style={styles.getStartedText}>Get Started →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modelHeading}>Personal Details</Text>
            <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="person-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Enter your full name"
                        placeholderTextColor={COLORS.inputText}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{ required: 'Name is required' }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <DropdownField
                    label="Gender"
                    options={genderOptions}
                    value={value}
                    onSelect={onChange}
                    error={errors.gender?.message}
                  />
                )}
                rules={{ required: 'Gender is required' }}
              />

              <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, value } }) => (
                  <DatePickerField
                    label="Date of Birth"
                    value={value}
                    onDateSelect={onChange}
                    error={errors.dob?.message}
                  />
                )}
                rules={{ required: 'Date of Birth is required' }}
              />
            </View>
            <GradientStepButtons onNext={next} onBack={prev} />
          </ScrollView>
        );
      case 3:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modelHeading}>Body & Food Details</Text>
            <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="food"
                render={({ field: { onChange, value } }) => (
                  <DropdownField
                    label="Food Preference"
                    options={foodOptions}
                    value={value}
                    onSelect={onChange}
                    error={errors.food?.message}
                  />
                )}
                rules={{ required: 'Food preference required' }}
              />

              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="scale-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="e.g., 70"
                        placeholderTextColor={COLORS.inputText}
                        keyboardType="decimal-pad"
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{ required: 'Weight is required' }}
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}

              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Height (cm)</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="resize-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="e.g., 180"
                        placeholderTextColor={COLORS.inputText}
                        keyboardType="decimal-pad"
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{ required: 'Height is required' }}
              />
              {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
            </View>
            <GradientStepButtons onNext={next} onBack={prev} />
          </ScrollView>
        );
      case 4:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modelHeading}>Contact Information</Text>
            <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="call-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Enter 10-digit number"
                        placeholderTextColor={COLORS.inputText}
                        keyboardType="phone-pad"
                        onChangeText={onChange}
                        value={value}
                        maxLength={10}
                      />
                    </View>
                  </View>
                )}
                rules={{ required: 'Mobile is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid mobile' } }}
              />
              {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="mail-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Enter your email"
                        placeholderTextColor={COLORS.inputText}
                        keyboardType="email-address"
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address'
                  }
                }}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>
            <GradientStepButtons onNext={next} onBack={prev} />
          </ScrollView>
        );
      case 5:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modelHeading}>Set Password</Text>
            <View style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Min 6 characters"
                        placeholderTextColor={COLORS.inputText}
                        secureTextEntry
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.iconInputWrapper}>
                      <Icon name="shield-checkmark-outline" size={20} color={COLORS.primary} style={styles.fieldIcon} />
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Re-enter password"
                        placeholderTextColor={COLORS.inputText}
                        secureTextEntry
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  </View>
                )}
                rules={{
                  required: 'Confirmation required',
                  validate: value =>
                    value === getValues('password') || 'Passwords do not match'
                }}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
            </View>
            <GradientStepButtons isFinal onNext={handleSubmit(submit)} onBack={prev} />
          </ScrollView>
        );
      default:
        return null;
    }
  };
  // GradientStepButtons
  const GradientStepButtons = ({ onNext, onBack, isFinal }) => (
    <View style={styles.buttonRow}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ flex: 1, marginHorizontal: 6 }}>
          <LinearGradient 
            colors={['#6b7280', '#4b5563']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
            style={styles.stepBtnSecondary}
          >
            <Icon name="chevron-back" size={24} color="#fff" style={{ marginRight: 5 }} />
            <Text style={styles.btnText}>Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onNext} style={{ flex: 1, marginHorizontal: 6 }}>
        <LinearGradient 
          colors={['#8b5cf6', '#6366f1']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
          style={styles.stepBtn}
        >
          <Text style={styles.btnText}>{isFinal ? 'Create Account' : 'Next'}</Text>
          <Icon name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Progress Indicator
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <View
          key={dot}
          style={[
            styles.progressDot,
            dot <= step && styles.progressDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        start={{ x: 0.80, y: 0.25 }} 
        end={{ x: 0.0, y: 0.10 }}
        locations={[0, 1, 0]}
        colors={['#8b5cf6', '#6366f1']}
        style={styles.container}
      >
        <View style={styles.topContainer}>
          <Text style={styles.topText}>Already have an account?</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.link}>Swasthya</Text>

        <ProgressIndicator />

        {/* Animated View for card */}
        <Animated.View
          style={[
            styles.card,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim
            }
          ]}
        >
          <StepContent />
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  topContainer: {
    marginTop: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 10,
  },
  topText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  link: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    paddingLeft: 20,
    marginTop: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: 'white',
    width: 24,
  },
  card: {
    padding: 20,
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    borderTopEndRadius: 28,
    borderTopLeftRadius: 28,
    height: '65%',
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  stepContent: {
    flex: 1,
  },
  modelHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
    marginVertical: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeImage: {
    width: '100%',
    height: 180,
    marginBottom: 20,
  },
  getStartedBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  getStartedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 14,
  },
  iconInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldInput: {
    flex: 1,
    height: 50,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  dropdownButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: COLORS.inputText,
  },
  dropdownOptionsContainer: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  dropdownOptionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  selectedOption: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: SCREEN_WIDTH - 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  dateInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 10,
  },
  dateModalButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  confirmButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
  },
  dateModalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 10,
  },
  stepBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  stepBtnSecondary: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
