import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Input, Card, Button, Avatar } from 'tamagui';
import { Search, Filter, Star } from '@tamagui/lucide-icons';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <YStack flex={1}>
      {/* Search Header */}
      <XStack padding="$4" space="$2" backgroundColor="white">
        <Input
          flex={1}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={Search}
        />
        <Button icon={Filter} variant="outlined" />
      </XStack>

      <ScrollView>
        <YStack padding="$4" space="$4">
          {/* Search Results */}
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} bordered padding="$3">
              <XStack space="$3">
                <Avatar circular size="$6" />
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="bold">Professional Service</Text>
                  <Text fontSize="$3" color="$gray9">by John Doe</Text>
                  <XStack space="$2" marginTop="$2">
                    <Star size={16} color="$yellow10" fill="$yellow10" />
                    <Text>4.9 (120 reviews)</Text>
                  </XStack>
                </YStack>
                <Text fontSize="$5" fontWeight="bold">$50/hr</Text>
              </XStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default SearchScreen;