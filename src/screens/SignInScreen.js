import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, Text, Input, Button, Image } from 'tamagui';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigation.replace('Home'); // Navigate to the home screen after successful sign-in
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" justifyContent="center">
        <Image source={require('../assets/logo.png')} style={{ width: 150, height: 150, alignSelf: 'center' }} />
        <Text fontSize={24} fontWeight="bold" textAlign="center" marginBottom="$4">Sign In</Text>

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
          onPress={handleSignIn}
          disabled={loading}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text fontSize={16} fontWeight="bold" color="#000000">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </Button>

        <XStack justifyContent="center" marginTop="$4">
          <Button variant="text" onPress={() => navigation.navigate('SignUp')}>
            <Text color="#EAAA00" fontSize={14}>
              Don't have an account? Sign Up
            </Text>
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
