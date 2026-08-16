import React from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick02Icon, Alert02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../components/ui/colors';

// Wrap Toast.show globally to log every toast trigger
const originalToastShow = Toast.show;
Toast.show = (options) => {
  const type = options?.type || 'info';
  const text1 = options?.text1 || '';
  const text2 = options?.text2 || options?.props?.text2 || '';
  console.log(`🔔 [TOAST ${type.toUpperCase()}]: ${text1}${text2 ? ` | ${text2}` : ''}`, options);
  if (typeof originalToastShow === 'function') {
    return originalToastShow.call(Toast, options);
  }
};

const SuccessToast = ({ text1, props }) => {
  const COLORS = useThemeColors();
  return (
    <View style={{ 
      backgroundColor: COLORS.success, 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <HugeiconsIcon icon={Tick02Icon} size={24} color={COLORS.buttonText} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: COLORS.buttonText, fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: COLORS.buttonText, marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  );
};

const ErrorToast = ({ text1, props }) => {
  const COLORS = useThemeColors();
  return (
    <View style={{ 
      backgroundColor: COLORS.danger, 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <HugeiconsIcon icon={Alert02Icon} size={24} color={COLORS.buttonText} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: COLORS.buttonText, fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: COLORS.buttonText, marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  );
};

const InfoToast = ({ text1, props }) => {
  const COLORS = useThemeColors();
  return (
    <View style={{ 
      backgroundColor: COLORS.info, 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <HugeiconsIcon icon={InformationCircleIcon} size={24} color={COLORS.buttonText} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: COLORS.buttonText, fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: COLORS.buttonText, marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  info: (props) => <InfoToast {...props} />,
};

export const showToast = (type, message, subMessage = '') => {
  console.log(`🔔 [showToast ${type?.toUpperCase()}]: ${message}${subMessage ? ` | ${subMessage}` : ''}`);
  Toast.show({
    type,
    text1: message,
    text2: subMessage,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 10,
  });
};
