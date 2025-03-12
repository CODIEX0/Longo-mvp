import React, { useState } from 'react';
import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { YStack, Text, Button, Input, XStack, useTheme } from 'tamagui';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SocialSignInButtons } from '../components/SocialSignInButtons';

const SignInScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
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

      navigation.replace('Home');
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <YStack
        flex={1}
        padding="$4"
        space="$4"
        backgroundColor={theme.background.val}
      >
        <YStack space="$2">
          <Text fontSize="$8" fontWeight="bold">
            Welcome Back
          </Text>
          <Text fontSize="$5" color="$gray10">
            Sign in to continue
          </Text>
        </YStack>

        <YStack space="$4" marginTop="$4">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Button
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="text"
            alignSelf="flex-end"
          >
            Forgot Password?
          </Button>
        </YStack>

        <Button
          theme="active"
          onPress={handleSignIn}
          disabled={!email || !password}
          marginTop="$4"
        >
          Sign In
        </Button>

        <SocialSignInButtons />

        <XStack justifyContent="center" space="$2" marginTop="auto">
          <Text>Don't have an account?</Text>
          <Button
            variant="text"
            theme="active"
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
