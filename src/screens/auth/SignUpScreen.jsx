import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
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
      
      <Button
        title="Sign Up"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default SignUpScreen;