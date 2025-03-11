import React from 'react';
import { Appearance } from 'react-native';
import { YStack, Image, Text, Button, useTheme } from 'tamagui';

// Determine the current color scheme
const colorScheme = Appearance.getColorScheme();

const WelcomeScreen = ({ navigation }) => {
  const theme = useTheme();
  
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$4"
      space="$6"
      alignItems="center"
      justifyContent="space-between"
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
        />
        <Text
          color="$color"
          fontSize={18}
          opacity={0.8}
          textAlign="center"
          maxWidth={300}
        >
          Where Skill Meets Opportunity
        </Text>
      </YStack>

      <YStack width="100%" space="$3" paddingBottom="$4">
        <Button
          backgroundColor="#EAAA00"
          height={50}
          onPress={() => navigation.navigate('Login')}
          pressStyle={{ opacity: 0.8 }}
          borderRadius={25}
        >
          <Text color="#000000" fontWeight="bold" fontSize={16}>
            Login
          </Text>
        </Button>
        <Button
          backgroundColor={theme.name === 'dark' ? '#FFFFFF' : '#333333'}
          height={50}
          onPress={() => navigation.navigate('SignUp')}
          pressStyle={{ opacity: 0.8 }}
          borderRadius={25}
        >
          <Text color={theme.name === 'dark' ? '#000000' : '#FFFFFF'} fontWeight="bold" fontSize={16}>
            Signup
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
};

export default WelcomeScreen; 