import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, Input, Button, Text } from 'tamagui';

const AdminLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store session token securely
        await AsyncStorage.setItem('adminSessionToken', data.sessionToken);
        
        // If temporary credentials, show warning
        if (data.isTemporary) {
          Alert.alert(
            'Security Warning',
            'You are using temporary credentials. Please change them immediately.'
          );
        }

        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <YStack padding="$4" space="$4">
      <Text fontSize="$6" fontWeight="bold">Admin Login</Text>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin}>Login</Button>
    </YStack>
  );
};

export default AdminLoginScreen; 