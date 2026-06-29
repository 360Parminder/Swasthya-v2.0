// src/config/toastConfig.js
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick02Icon, Alert02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../components/ui/colors';

export const toastConfig = {
  success: ({ text1, props, ...rest }) => {
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
  )},
  error: ({ text1, props, ...rest }) => {
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
  )},
  info: ({ text1, props, ...rest }) => {
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
  )}
};

export const showToast = (type, message, subMessage = '') => {
  Toast.show({
    type,
    text1: message,
    text2: subMessage,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 10,
  });
};
