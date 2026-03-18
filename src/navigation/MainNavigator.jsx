// src/navigation/MainNavigator.jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Connection from '../screens/connections/Connection';
import Icon from 'react-native-vector-icons/Ionicons';
import Medication from '../screens/medication/Medication';
import { View } from 'react-native';
import { useThemeColors } from '../components/ui/colors';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStackScreen() {
  const colors = useThemeColors();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          height: 56,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <HomeStack.Screen
        name="Connections"
        component={Connection}
        options={{
          headerShown: true,
          title: 'My Connections',
          headerBackVisible: false,
        }}
      />
      <HomeStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: true,
          title: 'Medication',
          headerBackVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStackScreen() {
  const colors = useThemeColors();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          height: 56,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitle: 'Your Profile',
      }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
const MainNavigator = () => {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          margin: 18,
        },
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 35,
          elevation: 15,
          backgroundColor: colors.cardBackground,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ConnectionsTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 44,
                  height: 44,
                  backgroundColor: colors.primary,
                  opacity: 0.15,
                  borderRadius: 22
                }} />
              )}
              <Icon
                name={iconName}
                color={focused ? colors.primary : colors.placeholder}
                size={24}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      {/* <Tab.Screen name="ConnectionsTab" component={Connection} /> */}
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} headerShown={false} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
