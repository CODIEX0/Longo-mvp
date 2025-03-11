import React, { useState } from 'react';
import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { YStack, XStack, Text, Input, Button, styled } from 'tamagui';
import { Image } from 'react-native';
import { signIn, signUp } from '../services/auth';

const StyledInput = styled(Input, {
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '#E8E8E8',
  borderRadius: 12,
  height: 56,
  paddingHorizontal: 16,
  fontSize: 16,
  marginVertical: 8,
  color: '$color',
});

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        navigation.replace('Onboarding');
        return;
      }
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <YStack flex={1} backgroundColor="$background" padding="$4" space="$4">
        <YStack flex={1} justifyContent="center" space="$6">
          <YStack space="$2" alignItems="center">
            <Image
              source={require('../../assets/longo.png')}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
            <Text color="$color" fontSize={32} fontWeight="bold">Longo</Text>
            <Text color="$color" fontSize={16} opacity={0.7}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>
          </YStack>

          <YStack space="$3">
            {!isLogin && (
              <StyledInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <StyledInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <StyledInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              backgroundColor="#EAAA00"
              color="#000000"
              size="$5"
              borderRadius={12}
              onPress={handleAuth}
              disabled={loading}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text fontSize={16} fontWeight="bold" color="#000000">
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Text>
            </Button>
          </YStack>
        </YStack>

        <XStack justifyContent="center" paddingBottom="$4">
          <Button variant="text" onPress={() => setIsLogin(!isLogin)}>
            <Text color="#EAAA00" fontSize={14}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;