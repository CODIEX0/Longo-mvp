import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Image } from 'tamagui';
import { Search, Star, Briefcase } from '@tamagui/lucide-icons';

const HomeScreen = () => {
  const categories = [
    { icon: '🎨', name: 'UI/UX Design', color: '#FFE5E5' },
    { icon: '💻', name: 'Development', color: '#E5F1FF' },
    { icon: '📝', name: 'Content Writing', color: '#E5FFE5' },
    { icon: '📊', name: 'Marketing', color: '#FFE5F6' }
  ];

  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        {/* Search Bar */}
        <Card bordered padding="$3">
          <XStack alignItems="center" space="$2">
            <Search size={20} color="$gray9" />
            <Text color="$gray9">Search freelance services...</Text>
          </XStack>
        </Card>

        {/* Categories */}
        <Text fontSize="$6" fontWeight="bold">Top Categories</Text>
        <XStack flexWrap="wrap" gap="$2">
          {categories.map((category) => (
            <Card
              key={category.name}
              width="48%"
              height={100}
              backgroundColor={category.color}
              padding="$3"
            >
              <Text fontSize={24}>{category.icon}</Text>
              <Text fontSize="$4" fontWeight="500">{category.name}</Text>
            </Card>
          ))}
        </XStack>

        {/* Featured Projects */}
        <Text fontSize="$6" fontWeight="bold">Featured Projects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$3">
            {[1, 2, 3].map((item) => (
              <Card key={item} width={280} height={180}>
                <Image
                  source={{ uri: `https://picsum.photos/280/180?random=${item}` }}
                  width={280}
                  height={120}
                />
                <Card.Footer padding="$2">
                  <Text fontSize="$4" fontWeight="500">Project Title</Text>
                  <XStack space="$2" alignItems="center">
                    <Star size={16} color="$yellow10" />
                    <Text>4.8</Text>
                  </XStack>
                </Card.Footer>
              </Card>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </ScrollView>
  );
};

export default HomeScreen;