import React, { useState } from 'react';
import { Appearance, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { YStack, Image, Text, Button, Input, XStack, useTheme } from 'tamagui';
import { auth, db } from '../../firebase';
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

// Determine the current color scheme
const colorScheme = Appearance.getColorScheme();

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      
      // Check if user needs to complete onboarding
      if (!userData.onboardingCompleted) {
        navigation.replace('Onboarding');
        return;
      }

      // Check if user account is active
      if (userData.status !== 'active') {
        throw new Error('Account is not active. Please contact support.');
      }

      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(true);
    try {
      let result;
      
      switch (provider) {
        case 'google':
          const googleProvider = new GoogleAuthProvider();
          if (Platform.OS === 'web') {
            result = await signInWithPopup(auth, googleProvider);
          } else {
            await signInWithRedirect(auth, googleProvider);
            result = await getRedirectResult(auth);
          }
          
          if (result?.user) {
            // Check if user profile exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            
            if (!userDoc.exists()) {
              // Create new user profile if it doesn't exist
              await setDoc(doc(db, 'users', result.user.uid), {
                email: result.user.email,
                name: result.user.displayName,
                photoURL: result.user.photoURL,
                status: 'active',
                createdAt: serverTimestamp(),
                onboardingCompleted: false
              });
              navigation.replace('Onboarding');
              return;
            }

            navigation.replace('MainTabs');
          }
          break;
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >    
      
      <YStack
        flex={1}
        backgroundColor="$background"
        padding="$4"
        space="$4"
      >
        <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
        <Image
          source={{ 
            uri: colorScheme === 'light' // Check the device's color scheme
              ? require('../../../assets/longo-light.png') // Light mode image
              : require('../../../assets/longo.png') // Dark mode image
          }}
          style={{ 
            width: 180, 
            height: 180, 
            alignSelf: 'center',
            marginTop: 20 
          }}
          alignSelf="top"
        />
        </YStack>

        <YStack flex={1} justifyContent="center" space="$4">
          <Input
            backgroundColor="$inputBackground"
            color="$inputText"
            borderColor="$inputBorder"
            borderWidth={1}
            height={56}
            placeholder="Email"
            placeholderTextColor={theme.name === 'dark' ? '#AAAAAA' : '#888888'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            borderRadius={12}
          />
          
          <Input
            backgroundColor="$inputBackground"
            color="$inputText"
            borderColor="$inputBorder"
            borderWidth={1}
            height={56}
            placeholder="Password"
            placeholderTextColor={theme.name === 'dark' ? '#AAAAAA' : '#888888'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            borderRadius={12}
          />

          <Button
            alignSelf="flex-end"
            variant="text"
            onPress={() => {/* Handle forgot password */}}
          >
            <Text color="#EAAA00">Forgot Password?</Text>
          </Button>

          <Button
            backgroundColor="#EAAA00"
            height={56}
            onPress={handleLogin}
            disabled={loading}
            pressStyle={{ opacity: 0.8 }}
            borderRadius={12}
          >
            <Text color="#000000" fontWeight="bold" fontSize={16}>
              {loading ? 'Loading...' : 'Login'}
            </Text>
          </Button>

          <XStack justifyContent="center" space="$2">
            <Text color="$color">Or Login Using</Text>
          </XStack>

          <XStack justifyContent="center" space="$4">
            <Button
              backgroundColor={theme.name === 'dark' ? '#FFFFFF' : '#EEEEEE'}
              size="$5"
              circular
              disabled={socialLoading}
              onPress={() => handleSocialLogin('google')}
            >
              <Text color="#DB4437" fontWeight="bold">G</Text>
            </Button>
            
          </XStack>
        </YStack>

        <Button
          variant="text"
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text color="#EAAA00">
            Don't have an account? Sign Up
          </Text>
        </Button>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen; 