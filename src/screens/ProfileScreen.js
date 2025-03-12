import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Avatar, Separator } from 'tamagui';
import { Settings, Star, Briefcase, Clock, DollarSign } from '@tamagui/lucide-icons';

const ProfileScreen = () => {
  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        {/* Profile Header */}
        <Card bordered padding="$4">
          <YStack space="$3" alignItems="center">
            <Avatar circular size="$8" />
            <Text fontSize="$6" fontWeight="bold">John Doe</Text>
            <Text color="$gray9">Full Stack Developer</Text>
            <XStack space="$4">
              <XStack space="$1" alignItems="center">
                <Star size={16} color="$yellow10" />
                <Text>4.9</Text>
              </XStack>
              <XStack space="$1" alignItems="center">
                <Briefcase size={16} />
                <Text>43 Projects</Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* Stats */}
        <XStack space="$2">
          <Card flex={1} bordered padding="$3">
            <YStack alignItems="center">
              <Text fontSize="$6" fontWeight="bold">$2350.50</Text>
              <Text color="$gray9">Earnings</Text>
            </YStack>
          </Card>
          <Card flex={1} bordered padding="$3">
            <YStack alignItems="center">
              <Text fontSize="$6" fontWeight="bold">2,450</Text>
              <Text color="$gray9">Points</Text>
            </YStack>
          </Card>
        </XStack>

        {/* Portfolio */}
        <Text fontSize="$6" fontWeight="bold">Portfolio</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$2">
            {[1, 2, 3].map((item) => (
              <Card key={item} width={200} height={150}>
                <Image
                  source={{ uri: `https://picsum.photos/200/150?random=${item}` }}
                  width={200}
                  height={150}
                />
              </Card>
            ))}
          </XStack>
        </ScrollView>

        {/* Settings Button */}
        <Button 
          icon={Settings}
          variant="outlined"
          marginTop="$4"
        >
          Account Settings
        </Button>
      </YStack>
    </ScrollView>
  );
};

export default ProfileScreen;