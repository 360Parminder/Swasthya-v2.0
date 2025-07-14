// src/navigation/MainNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Connection from '../screens/connections/Connection';
import { Ionicons } from '@expo/vector-icons'; // Import icons if using

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen 
        name="Connections" 
        component={Connection} 
        options={{ 
          headerShown: true,
          title: 'My Connections', // Custom title
        }} 
      />
    </HomeStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackScreen} 
        options={{
          title: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="home" color={color} size={size} />
          // ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackScreen} 
        options={{
          title: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="person" color={color} size={size} />
          // ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;