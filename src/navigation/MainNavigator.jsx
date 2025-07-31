// src/navigation/MainNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Connection from '../screens/connections/Connection';
import Icon from 'react-native-vector-icons/FontAwesome';
import Medication from '../screens/medication/Medication';
import { View } from 'react-native';
import { COLORS } from '../components/ui/colors';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStackScreen() {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: COLORS.background,
          height: 56,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitle: route.name === 'HomeMain' ? 'Home' : route.name,
        // headerLeft: ({ canGoBack }) =>
        //   canGoBack ? (
        //     <Icon
        //       name="angle-left"
        //       size={30}
        //       color={COLORS.text}
        //       style={{ marginLeft: 10 }}
        //       onPress={() => navigation.goBack()}
        //     />
        //   ) : null,


      })}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Connections"
        component={Connection}
        options={{
          headerShown: true,
          title: 'My Connections',
        }}
      />
      <HomeStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: true,
          title: 'Medication',
        }}
      />
    </HomeStack.Navigator>
  );
}


// Profile Stack Navigator
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator 
       screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: COLORS.background,
          height: 56,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitle: route.name === 'HomeMain' ? 'Home' : route.name,
        // headerLeft: ({ canGoBack }) =>
        //   canGoBack ? (
        //     <Icon
        //       name="angle-left"
        //       size={30}
        //       color={COLORS.text}
        //       style={{ marginLeft: 10 }}
        //       onPress={() => navigation.goBack()}
        //     />
        //   ) : null,


      
    })}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
// ... imports here ...

const MainNavigator = () => {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 65,
          borderRadius: 25,
          marginHorizontal: 20,
          marginBottom: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 12,
          backgroundColor: '#292c339e',
          borderColor: '#3D414D',
          borderWidth: 1,
          borderTopWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'

        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = 'house';
          } else if (route.name === 'ProfileTab') {
            iconName = 'user';
          }
          return (
            <View style={{
              // backgroundColor:'blue',
              borderRadius: 999,
              // paddingHorizontal:10,
              paddingVertical: 8,
              // flexDirection:'row',
              alignItems: 'center',
              justifyContent: 'center',
              // gap:6,
              width: 40,
              height: 40

            }}>
              <Icon name={iconName} color={focused ? color : 'gray'} size={size} />
            </View>
          );
        },

      })}

    >

      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;