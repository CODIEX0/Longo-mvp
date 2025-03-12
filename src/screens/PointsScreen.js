import React from 'react';
import { YStack, XStack, Text, Card, Progress, ScrollView } from 'tamagui';
import { Award, Star, Trophy } from '@tamagui/lucide-icons';

const PointsScreen = () => {
  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        <Card elevate bordered>
          <Card.Header>
            <XStack space="$2" alignItems="center">
              <Trophy size={24} color="$yellow10" />
              <Text fontSize="$6" fontWeight="bold">Your Points</Text>
            </XStack>
          </Card.Header>
          
          <YStack padding="$4" space="$4">
            <Text fontSize="$8" fontWeight="bold" color="$blue10">
              2,450
            </Text>
            <Progress value={70} max={100}>
              <Progress.Indicator animation="bouncy" />
            </Progress>
            <Text>70% to next level</Text>
          </YStack>
        </Card>

        <Text fontSize="$6" fontWeight="bold">Recent Activity</Text>
        <YStack space="$2">
          {/* Activity items */}
          <Card bordered>
            <Card.Header>
              <XStack space="$2" alignItems="center">
                <Star size={20} color="$green10" />
                <Text>Completed Task</Text>
                <Text marginLeft="auto" color="$green10">+50 points</Text>
              </XStack>
            </Card.Header>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
}; 