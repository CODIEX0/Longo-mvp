import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from 'tamagui';

// Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LiveAdsScreen from '../screens/LiveAdsScreen';
import LeaderboardsScreen from '../screens/LeaderboardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import BidScreen from '../screens/BidScreen';
import MessagesScreen from '../screens/MessagesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Home, Search, MessageCircle, Bell, Settings, User } from '@tamagui/lucide-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor.val,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#EAAA00',
        tabBarInactiveTintColor: theme.gray.val,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
          tabBarBadge: 3, // Example of notification badge
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} />
          ),
          tabBarBadge: 5, // Example of notification badge
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Settings Stack Navigator
const SettingsStack = createStackNavigator();
const SettingsNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    {/* Add other settings-related screens here */}
  </SettingsStack.Navigator>
);

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setOnboardingComplete(userDoc.data().onboardingCompleted || false);
        }
      }
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ animationEnabled: false }}
          />
        ) : !onboardingComplete ? (
          // Onboarding Stack
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{ animationEnabled: false }}
          />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen 
              name="Settings" 
              component={SettingsNavigator}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#EAAA00',
                },
                headerTintColor: '#000000',
              }}
            />
            <Stack.Screen 
              name="Bid" 
              component={BidScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#EAAA00',
                },
                headerTintColor: '#000000',
              }}
            />
            <Stack.Screen 
              name="LiveAds" 
              component={LiveAdsScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#EAAA00',
                },
                headerTintColor: '#000000',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;