import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../components/common/Input';
import { COLORS } from '../../components/ui/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({ mode: 'onChange' });

  // Animate in on step change
  useEffect(() => {
    slideAnim.setValue(SCREEN_HEIGHT); // start from bottom
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  const submit = (data) => {
    // Handle signup logic
    // navigation.navigate('SignIn');
  };

  const buttonGradient = {
    start: { x: 0.80, y: 0.25 },
    end: { x: 0.0, y: 0.10  },
    colors: ['#807de4b7', '#322ed4'],
    locations: [0, 1, 0],
  };

  // Your StepContent as before...
  // For brevity, only step 1 & 2 shown but keep all cases as in your code
   const StepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Image
              source={require('../../../assets/images/welcome.png')}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: COLORS.textSecondary }}>Swasthya</Text>
            <Text style={styles.subtitle}>Your journey towards better health begins here!</Text>
            <TouchableOpacity onPress={next} style={{ marginTop: 30 }}>
              <LinearGradient {...buttonGradient} style={styles.getStartedBtn}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.modelHeading}>Personal Details</Text>
            <Input
              control={control}
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              rules={{ required: 'Name is required' }}
            />
            <Input
              control={control}
              name="gender"
              label="Gender"
              placeholder="Enter your gender"
              error={errors.gender?.message}
              rules={{ required: 'Gender is required' }}
            />
            <Input
              control={control}
              name="dob"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              error={errors.dob?.message}
              rules={{ required: 'Date of Birth is required' }}
            />
            <GradientStepButtons onNext={next} onBack={prev} gradient={buttonGradient} />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.modelHeading}>Body & Food Details</Text>
            <Input
              control={control}
              name="food"
              label="Food Preference"
              placeholder="e.g., Veg/Non-Veg"
              error={errors.food?.message}
              rules={{ required: 'Food preference required' }}
            />
            <Input
              control={control}
              name="weight"
              label="Weight"
              placeholder="kg"
              error={errors.weight?.message}
              rules={{ required: 'Weight is required' }}
            />
            <Input
              control={control}
              name="height"
              label="Height"
              placeholder="cm"
              error={errors.height?.message}
              rules={{ required: 'Height is required' }}
            />
            <GradientStepButtons onNext={next} onBack={prev} gradient={buttonGradient} />
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.modelHeading}>Contact Information</Text>
            <Input
              control={control}
              name="mobile"
              label="Mobile"
              placeholder="Mobile number"
              error={errors.mobile?.message}
              rules={{ required: 'Mobile is required' }}
            />
            <Input
              control={control}
              name="email"
              label="Email"
              placeholder="Email address"
              error={errors.email?.message}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address'
                }
              }}
            />
            <GradientStepButtons onNext={next} onBack={prev} gradient={buttonGradient} />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.modelHeading}>Set Password</Text>
            <Input
              control={control}
              name="password"
              label="Password"
              placeholder="Enter password"
              secureTextEntry
              error={errors.password?.message}
              rules={{ required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
            />
            <Input
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter password"
              secureTextEntry
              error={errors.confirmPassword?.message}
              rules={{
                required: 'Confirmation required',
                validate: value =>
                  value === getValues('password') || 'Passwords do not match'
              }}
            />
            <GradientStepButtons isFinal onNext={handleSubmit(submit)} onBack={prev} gradient={buttonGradient} />
          </View>
        );
      default:
        return null;
    }
  };

  // GradientStepButtons same as before...
  const GradientStepButtons = ({ onNext, onBack, isFinal, gradient }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22 }}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ flex: 1, marginHorizontal: 4 }}>
          <LinearGradient {...gradient} style={styles.stepBtnSecondary}>
            <Text style={styles.btnText}>Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onNext} style={{ flex: 1, marginHorizontal: 4 }}>
        <LinearGradient {...gradient} style={styles.stepBtn}>
          <Text style={styles.btnText}>{isFinal ? 'Finish & Sign Up' : 'Next'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
         start={{ x: 0.80, y: 0.25 }} end={{ x: 0.0, y: 0.10 }}
         locations={[0, 1, 0]}
         colors={['#807de4b7', '#322ed4']}
         style={styles.container}
       >
      <View style={styles.topContainer}>
        <Text style={{ color: COLORS.text }}>Already have an account?</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#9896fe93', padding: 10, borderRadius: 10 }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.link}>Swasthya</Text>

      {/* Animated View for card */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <StepContent />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  welcomeImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  topContainer: {
    marginTop: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    padding: 20,
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    borderRadius: 30,
    height: '65%',
    marginBottom: 0,
    // Optionally, add a shadow/elevation for modal feeling:
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
  modelHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.text,
    fontSize: 26,
    marginBottom: 18,
    textAlign: 'center',
  },
  getStartedBtn: {
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  getStartedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  stepBtn: {
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 2,
  },
  stepBtnSecondary: {
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 2,
    opacity: 0.65,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  link: {
    fontSize: 60,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
});

export default SignUpScreen;
