import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
  mobile: yup.string().required('Mobile number is required'),
  password: yup.string().required('Password is required'),
});

const SignInScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
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
    try {
      await login(data.mobile, data.password);
      showToast('success', 'Welcome back!');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'An error occurred');

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <Input
        control={control}
        name="mobile"
        label="Mobile Number"
        placeholder="Enter your mobile number"
        error={errors.mobile?.message}
        keyboardType="phone-pad"
      />
      
      <Input
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password?.message}
      />
      
      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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

export default SignInScreen;