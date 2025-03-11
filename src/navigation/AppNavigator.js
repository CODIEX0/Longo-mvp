import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { firebase, db } from '../firebase';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import LiveAdsScreen from '../screens/LiveAdsScreen';
import LeaderboardsScreen from '../screens/LeaderboardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import BidScreen from '../screens/BidScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { auth } from '../firebase';
import { onAuthStateChanged } from '@firebase/auth';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#000000',
        paddingBottom: 8,
        height: 60,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: '#EAAA00',
      tabBarInactiveTintColor: '#FFFFFF',
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#FFFFFF',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="home" type="material" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="search" type="material" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="LiveAds"
      component={LiveAdsScreen}
      options={{
        title: 'Live',
        tabBarIcon: ({ color }) => (
          <Icon name="live-tv" type="material" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Leaderboards"
      component={LeaderboardsScreen}
      options={{
        title: 'Leaders',
        tabBarIcon: ({ color }) => (
          <Icon name="leaderboard" type="material" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="person" type="material" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
          <Stack.Screen name="MainTabs" component={MainTabs}  />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;