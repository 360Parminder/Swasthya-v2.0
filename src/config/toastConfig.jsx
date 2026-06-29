// src/config/toastConfig.js
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tick02Icon, Alert02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
export const toastConfig = {
  success: ({ text1, props, ...rest }) => (
    <View style={{ 
      backgroundColor: '#4BB543', 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <HugeiconsIcon icon={Tick02Icon} size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: 'white', marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  ),
  error: ({ text1, props, ...rest }) => (
    <View style={{ 
      backgroundColor: '#FF3333', 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
      }}>
        <HugeiconsIcon icon={Alert02Icon} size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: 'white', marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  ),
  info: ({ text1, props, ...rest }) => (
    <View style={{ 
      backgroundColor: '#007AFF', 
      padding: 15, 
      borderRadius: 8,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <HugeiconsIcon icon={InformationCircleIcon} size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: 'white', marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  )
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
