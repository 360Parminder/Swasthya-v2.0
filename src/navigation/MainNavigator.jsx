// src/navigation/MainNavigator.jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Connection from '../screens/connections/Connection';
import Icon from 'react-native-vector-icons/Feather';
import Medication from '../screens/medication/Medication';
import MedicationHistory from '../screens/medication/MedicationHistory';
import AlarmScreen from '../screens/home/AlarmScreen';

import { View } from 'react-native';
import { useThemeColors } from '../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native'
import { FirstAidKitIcon, Home01Icon, Notification03Icon, UserGroup03Icon, UserIcon } from '@hugeicons/core-free-icons'
import HydrationScreen from '../screens/Hydration/HydrationScreen';

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
          headerShown: false,
          title: 'My Connections',
          headerBackVisible: false,
        }}
      />
      <HomeStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: false,
          title: 'Medication',
          headerBackVisible: false,
        }}
      />
      <HomeStack.Screen
        name="AlarmScreen"
        component={AlarmScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal'
        }}
      />
      <HomeStack.Screen
        name="MedicationHistory"
        component={MedicationHistory}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Hydration"
        component={HydrationScreen}
        options={{
          headerShown: false,
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
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
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
          margin: 10,
        },
        tabBarStyle: {
          position: 'absolute',
          height: 60,
          marginHorizontal: 10,
          bottom: 10,
          left: 10,
          right: 10,
          borderRadius: 18,
          elevation: 15,
          backgroundColor: colors.cardBackground,
          borderWidth: 0.5,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,

        },
        tabBarIcon: ({ focused }) => {
          let targetIcon;
          if (route.name === 'HomeTab') {
            targetIcon = Home01Icon;
          } else if (route.name === 'ProfileTab') {
            targetIcon = UserIcon;
          } else if (route.name === 'ConnectionsTab') {
            targetIcon = UserGroup03Icon;
          } else if (route.name === 'MedicationTab') {
            targetIcon = FirstAidKitIcon;
          }

          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  opacity: 0.15,
                  borderRadius: 10
                }} />
              )}
              {/* <Icon
                name={iconName}
                color={focused ? colors.primary : colors.placeholder}
                size={24}
              /> */}
              <HugeiconsIcon
                icon={targetIcon}
                color={focused ? colors.primary : colors.placeholder}
                size={24}
                strokeWidth={1.5}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      <Tab.Screen name="MedicationTab" component={Medication} />
      <Tab.Screen name="ConnectionsTab" component={Connection} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
      {/* <Tab.Screen name="AlarmScreen" component={AlarmScreen} /> */}
    </Tab.Navigator>
  );
};

export default MainNavigator;
