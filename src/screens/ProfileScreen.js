import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, Text, Image, XStack, Button, ScrollView, useTheme, Input } from 'tamagui';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
          setName(data.name);
          setEmail(data.email);
          setBio(data.bio || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
        console.error('Profile load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
        <ActivityIndicator size="large" color="#EAAA00" />
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView>
        <YStack flex={1} padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
          <Image source={{ uri: profile?.photoURL || 'https://via.placeholder.com/150' }} style={{ width: 150, height: 150, borderRadius: 75, alignSelf: 'center' }} />
          <Text fontSize={24} fontWeight="bold" textAlign="center" marginTop="$4">Profile</Text>

          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
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
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            marginBottom="$4"
          />

          <Button
            backgroundColor="#EAAA00"
            color="#000000"
            size="$5"
            borderRadius={12}
            onPress={() => Alert.alert('Success', 'Profile updated!')}
            pressStyle={{ opacity: 0.8 }}
          >
            <Text fontSize={16} fontWeight="bold" color="#000000">Update Profile</Text>
          </Button>

          <Button
            backgroundColor="#FF0000"
            color="#FFFFFF"
            size="$5"
            borderRadius={12}
            onPress={handleSignOut}
            marginTop="$4"
            pressStyle={{ opacity: 0.8 }}
          >
            <Text fontSize={16} fontWeight="bold" color="#FFFFFF">Sign Out</Text>
          </Button>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;