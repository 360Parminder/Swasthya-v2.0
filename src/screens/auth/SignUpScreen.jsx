import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../components/ui/colors';
import LinearGradient from 'react-native-linear-gradient';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignUpScreen = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await register(data.email, data.password, data.name);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Registration error:', error);
      // Optionally show toast or message
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#7264a8', '#3e3791', '#282356']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <Text style={{ color: COLORS.text }}>Already have an account?</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#9896fe93', padding: 10, borderRadius: 10 }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.link}>Swasthya</Text>

      <View style={styles.formContainer}>
        <View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <Input
          control={control}
          name="name"
          label="Name"
          placeholder="Enter your name"
          error={errors.name?.message}
        />
        <Input
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          keyboardType="email-address"
        />
        <Input
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password?.message}
        />
        <Input
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword?.message}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <LinearGradient
              start={{ x: 0.80, y: 0.25 }} end={{ x: 0.0, y: 0.10 }}
              locations={[0, 1, 0]}
              colors={['#807de4b7', '#322ed4']}
              style={{ width: 200, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 18 }}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
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
  formContainer: {
    padding: 20,
    backgroundColor:"white",
    width: '100%',
    borderRadius: 40,
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
});
