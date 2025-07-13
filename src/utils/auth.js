import * as Keychain from 'react-native-keychain';

export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Keychain couldn\'t be accessed:', error);
    return null;
  }
};