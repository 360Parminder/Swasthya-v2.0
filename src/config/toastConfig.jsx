// src/config/toastConfig.js
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

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
      <Icon name="checkmark-circle" size={24} color="white" />
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
        <Icon name="alert-circle" size={24} color="white" />
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
      <Icon name="information-circle" size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        {props?.text2 && (
          <Text style={{ color: 'white', marginTop: 4 }}>{props.text2}</Text>
        )}
      </View>
    </View>
  )
};
