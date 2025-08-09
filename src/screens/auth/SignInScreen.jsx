import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../components/ui/colors';
import LinearGradient from 'react-native-linear-gradient';

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
    if (data.mobile && data.password) {
      try {
        await login(data.mobile, data.password);
        showToast('success', 'Welcome back!');
      } catch (error) {
        showToast('error', error.response?.data?.message || 'An error occurred');

      }
    } else {
      showToast('error', 'Please fill in all fields');
    }
  };

  return (

    <LinearGradient
      start={{ x: 0.80, y: 0.25 }} end={{ x: 0.0, y: 0.10 }}
      locations={[0, 1, 0]}
      colors={['#807de4b7', '#322ed4']}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <Text style={{ color: COLORS.text }}>Dont have an account?</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#9896fe93', padding: 10, borderRadius: 10 }}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
            Get started
          </Text>
        </TouchableOpacity>
      </View>


      <Text style={styles.link}>
        Swasthya
      </Text>


      <View style={styles.formContainer}>
        <View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your details below</Text>
        </View>
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
          >
            <LinearGradient
              start={{ x: 0.80, y: 0.25 }} end={{ x: 0.0, y: 0.10 }}
              locations={[0, 1, 0]}
              colors={['#807de4b7', '#322ed4']}
              style={{ width: 200, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', }}
            >
              <Text style={{ color: COLORS.text }}>
                Sign In
              </Text>

            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between', // This will push content to top and bottom
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
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '65%',
    marginBottom: 0, // Add some bottom margin
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
