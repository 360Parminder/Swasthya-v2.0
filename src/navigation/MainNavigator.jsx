// src/navigation/MainNavigator.jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Connection from '../screens/connections/Connection';

import Medication from '../screens/medication/Medication';
import MedicationHistory from '../screens/medication/MedicationHistory';
import RefillAlertScreen from '../screens/medication/RefillAlertScreen';
import AlarmScreen from '../screens/home/AlarmScreen';

import React, { useRef, useEffect } from 'react';
import { Platform, View, Animated } from 'react-native';
import { useThemeColors } from '../components/ui/colors';
import { HugeiconsIcon } from '@hugeicons/react-native'
import { FirstAidKitIcon, Home01Icon, Notification03Icon, UserGroup03Icon, UserIcon } from '@hugeicons/core-free-icons'
import HydrationScreen from '../screens/Hydration/HydrationScreen';
import HydrationHistoryScreen from '../screens/Hydration/HydrationHistoryScreen';
import HydrationSettingsScreen from '../screens/Hydration/HydrationSettingsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SleepDetailsScreen from '../screens/sleep/SleepDetailsScreen';
import SleepScheduleScreen from '../screens/sleep/SleepScheduleScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const MedicationStack = createNativeStackNavigator();
const ConnectionsStack = createNativeStackNavigator();

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
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: false,
          title: 'Medication',
          headerBackVisible: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
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
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="RefillAlerts"
        component={RefillAlertScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="Hydration"
        component={HydrationScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="HydrationHistory"
        component={HydrationHistoryScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="HydrationSettings"
        component={HydrationSettingsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
      <HomeStack.Screen
        name="SleepDetails"
        component={SleepDetailsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="SleepSchedule"
        component={SleepScheduleScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <HomeStack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </HomeStack.Navigator>
  );
}

// Medication Stack Navigator
function MedicationStackScreen() {
  const colors = useThemeColors();
  return (
    <MedicationStack.Navigator
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
      <MedicationStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: false,
        }}
      />
      <MedicationStack.Screen
        name="MedicationHistory"
        component={MedicationHistory}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <MedicationStack.Screen
        name="RefillAlerts"
        component={RefillAlertScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <MedicationStack.Screen
        name="Connections"
        component={Connection}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <MedicationStack.Screen
        name="AlarmScreen"
        component={AlarmScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <MedicationStack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </MedicationStack.Navigator>
  );
}

// Connections Stack Navigator
function ConnectionsStackScreen() {
  const colors = useThemeColors();
  return (
    <ConnectionsStack.Navigator
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
      <ConnectionsStack.Screen
        name="Connections"
        component={Connection}
        options={{
          headerShown: false,
        }}
      />
      <ConnectionsStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ConnectionsStack.Screen
        name="MedicationHistory"
        component={MedicationHistory}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ConnectionsStack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </ConnectionsStack.Navigator>
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
      <ProfileStack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ProfileStack.Screen
        name="Connections"
        component={Connection}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ProfileStack.Screen
        name="Medication"
        component={Medication}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ProfileStack.Screen
        name="MedicationHistory"
        component={MedicationHistory}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ProfileStack.Screen
        name="RefillAlerts"
        component={RefillAlertScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </ProfileStack.Navigator>
  );
}

// Smooth Animated Tab Icon with Spring and Crossfade
const AnimatedTabIcon = ({ focused, icon: TargetIcon, colors }) => {
  const animValue = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(animValue, {
          toValue: 1,
          friction: 6,
          tension: 130,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.15,
            duration: 110,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            friction: 5,
            tension: 90,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <View style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
      {/* Animated Circular Colored Bubble */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
          transform: [{ scale: animValue }],
          opacity: animValue,
        }}
      />
      {/* Animated Icon with subtle scale bounce and smooth crossfade */}
      <Animated.View
        style={{
          transform: [{ scale: bounceAnim }],
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Inactive dark icon */}
        <Animated.View
          style={{
            position: 'absolute',
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          <HugeiconsIcon
            icon={TargetIcon}
            color={colors.textPrimary || '#111827'}
            size={22}
            strokeWidth={1.8}
          />
        </Animated.View>

        {/* Active white icon */}
        <Animated.View
          style={{
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}
        >
          <HugeiconsIcon
            icon={TargetIcon}
            color="#FFFFFF"
            size={22}
            strokeWidth={2}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        lazy: true,
        safeAreaInsets: { bottom: 0, top: 0 },
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 0,
          marginVertical: 0,
          marginTop:10
        },
        tabBarStyle: {
          position: 'absolute',
          height: 60,
          marginHorizontal: 20,
          bottom: Platform.OS === 'ios' ? 24 : 14,
          left: 0,
          right: 0,
          borderRadius: 30,
          elevation: 12,
          backgroundColor: colors.surface || colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          paddingHorizontal: 2,
          paddingBottom: 0,
          paddingTop: 0,
          justifyContent: 'center',
          alignItems: 'center',
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
            <AnimatedTabIcon
              focused={focused}
              icon={targetIcon}
              colors={colors}
            />
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} />
      <Tab.Screen name="MedicationTab" component={MedicationStackScreen} />
      <Tab.Screen name="ConnectionsTab" component={ConnectionsStackScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
      {/* <Tab.Screen name="AlarmScreen" component={AlarmScreen} /> */}
    </Tab.Navigator>
  );
};

export default MainNavigator;
