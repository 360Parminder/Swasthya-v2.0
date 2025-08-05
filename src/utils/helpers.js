import Toast from "react-native-toast-message";


export const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3200,
      autoHide: true,
      topOffset: 55,
    });
  };
