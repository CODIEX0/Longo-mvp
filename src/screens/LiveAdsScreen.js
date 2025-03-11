import React, { useState, useEffect } from 'react';
import { YStack, Text, FlatList, TouchableOpacity, useTheme } from 'tamagui';
import { getLiveAds } from '../services/database';
import { firebase, db } from '../firebase';

const LiveAdsScreen = () => {
  const [liveAds, setLiveAds] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadAds = async () => {
      const ads = await getLiveAds();
      setLiveAds(ads);
    };
    loadAds();
  }, []);

  return (
    <YStack flex={1} padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
      <Text fontSize={24} fontWeight="bold">Live Now</Text>
      <FlatList
        data={liveAds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ backgroundColor: '#FFFFFF', margin: 16, padding: 16, borderRadius: 8 }}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </YStack>
  );
};

export default LiveAdsScreen;