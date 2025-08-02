import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../ui/colors';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this package

const Input = ({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error ? styles.errorInput : null]}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              keyboardType={keyboardType}
            />
            {secureTextEntry && (
              <TouchableOpacity 
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    columnGap: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 5,
    marginLeft: 5,
  },
  input: {
    height: 40,
    color: COLORS.text,
    fontSize: 16,
    marginTop: -5,
    flex: 1,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default Input;
