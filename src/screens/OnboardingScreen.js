import React, { useState } from 'react';
import { YStack, Text, TextInput, Button, useTheme, Image, KeyboardAvoidingView, Platform } from 'tamagui';
import { supabase } from '../supabase';

const OnboardingScreen = ({ navigation }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const handleFinish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            name: `${name} ${surname}`,
            occupation,
            bio,
            location,
            points: 0,
            tasksCompleted: [],
            createdAt: new Date().toISOString(),
          },
        ]);

      navigation.replace('Home');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
        <Image source={require('../../assets/longo.png')} style={{ width: 150, height: 150, alignSelf: 'center' }} />
        <Text fontSize={24} fontWeight="bold" textAlign="center" marginBottom="$4">Create Your Profile</Text>

        <TextInput placeholder="Name" value={name} onChangeText={setName} marginBottom="$2" />
        <TextInput placeholder="Surname" value={surname} onChangeText={setSurname} marginBottom="$2" />
        <TextInput placeholder="Occupation (optional)" value={occupation} onChangeText={setOccupation} marginBottom="$2" />
        <TextInput placeholder="Bio (optional)" value={bio} onChangeText={setBio} marginBottom="$2" />
        <TextInput placeholder="Location" value={location} onChangeText={setLocation} marginBottom="$4" />

        <Button
          backgroundColor="#EAAA00"
          color="#000000"
          size="$5"
          borderRadius={12}
          onPress={handleFinish}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text fontSize={16} fontWeight="bold" color="#000000">Finish</Text>
        </Button>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default On