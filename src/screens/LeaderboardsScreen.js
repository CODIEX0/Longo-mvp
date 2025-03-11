import React, { useState, useEffect } from 'react';
import { YStack, Text, FlatList, useTheme, Image } from 'tamagui';
import { supabase } from '../supabase';

const LeaderboardsScreen = () => {
  const [leaders, setLeaders] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('points', { ascending: false })
          .limit(10);

        if (error) throw error;
        setLeaders(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <YStack flex={1} padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
      <Image
        source={{ 
          uri: colorScheme === 'light'
            ? require('../../assets/longo-light.png')
            : require('../../assets/longo.png')
        }}
        style={{ 
          width: 180, 
          height: 180, 
          alignSelf: 'center',
          marginTop: 20 
        }}
      />
      <Text fontSize={24} fontWeight="bold" textAlign="center" marginBottom="$4">Top Performers</Text>
      <FlatList
        data={leaders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <YStack flexDirection="row" alignItems="center" backgroundColor="#FFFFFF" margin={8} padding={16} borderRadius={8}>
            <Text>{index + 1}</Text>
            <YStack marginLeft={16}>
              <Text fontWeight="bold">{item.name}</Text>
              <Text>{item.points} points</Text>
            </YStack>
          </YStack>
        )}
      />
    </YStack>
  );
};

export default LeaderboardsScreen;