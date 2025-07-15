import React from 'react';
import { View, Text, StyleSheet, Button, Touchable, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { authState, logout } = useAuth();

  return (
    <View style={styles.container}>
     <View style={{ alignItems: 'center', marginBottom: 20,display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
       <Image
         source={{ uri: authState.user?.avatar }}
         style={styles.profilePicture}
       />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>Hello {authState.user?.username || 'User'}</Text>
          <Text style={styles.subtitle}>{authState.user?.email}</Text>
        </View>
      </View>
      <View style={{ marginTop: 20, display: 'flex',flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',width:300 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Medication')} style={{ marginTop: 20, padding: 10, backgroundColor:"lightblue", borderRadius: 5 }}>
          <Text style={{ color: 'black' }}>
            Medication
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Connections')}  style={{ marginTop: 20, padding: 10, backgroundColor:"lightblue", borderRadius: 5 }}>
          <Text style={{ color: 'black' }}>
            Connections
          </Text>
        </TouchableOpacity>
        
      </View>
      {/* <Button title="Logout" onPress={logout} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default HomeScreen;