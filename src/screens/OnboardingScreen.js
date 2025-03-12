import React, { useState } from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { YStack, Text, Button, Input, useTheme } from 'tamagui';
import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LoadingSpinner } from '../components/LoadingSpinner';

const OnboardingScreen = ({ navigation }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: `${name} ${surname}`,
        occupation,
        bio,
        location,
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      });

      navigation.replace('Home');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
        <Text fontSize="$8" fontWeight="bold">
          Complete Your Profile
        </Text>
        <Text fontSize="$5" color="$gray10">
          Let's get to know you better
        </Text>

        <YStack space="$4" marginTop="$4">
          <Input
            placeholder="First Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            placeholder="Last Name"
            value={surname}
            onChangeText={setSurname}
            autoCapitalize="words"
          />
          <Input
            placeholder="Occupation"
            value={occupation}
            onChangeText={setOccupation}
          />
          <Input
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            height={100}
          />
          <Input
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </YStack>

        <Button
          theme="active"
          onPress={handleFinish}
          disabled={!name || !surname}
          marginTop="auto"
        >
          Complete Profile
        </Button>
      </YStack>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;