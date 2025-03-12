import React, { useState } from 'react';
import { Appearance, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { YStack, Image, Text, Button, Input, XStack, useTheme } from 'tamagui';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Determine the current color scheme
const colorScheme = Appearance.getColorScheme();

const SignUpScreen = ({ navigation }) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role: 'client',
        status: 'active',
        points: 0,
        tasksCompleted: [],
        createdAt: serverTimestamp(),
        onboardingCompleted: false
      });

      navigation.replace('Onboarding');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result.user) {
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ')[1] || '',
          role: 'client',
          status: 'active',
          points: 0,
          tasksCompleted: [],
          createdAt: serverTimestamp(),
          onboardingCompleted: false
        });

        navigation.replace('Onboarding');
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" justifyContent="center">
        <Image
          source={{
            uri: colorScheme === 'light'
              ? require('../../../assets/longo-light.png')
              : require('../../../assets/longo.png'),
          }}
          style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: 20 }}
        />
        <Text fontSize={24} fontWeight="bold" textAlign="center" marginBottom="$4">Sign Up</Text>

        <Input
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          marginBottom="$2"
        />

        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          marginBottom="$2"
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          marginBottom="$2"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          marginBottom="$4"
        />

        <Button
          backgroundColor="#EAAA00"
          color="#000000"
          size="$5"
          borderRadius={12}
          onPress={handleSignUp}
          disabled={loading}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text fontSize={16} fontWeight="bold" color="#000000">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </Button>

        <XStack justifyContent="center" marginTop="$4">
          <Button variant="text" onPress={() => navigation.navigate('SignIn')}>
            <Text color="#EAAA00" fontSize={14}>
              Already have an account? Sign In
            </Text>
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen; 