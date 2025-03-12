import React, { useState } from 'react';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { MapPin, Navigation } from '@tamagui/lucide-icons';
import MapView, { Marker } from 'react-native-maps';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5);

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Card elevate bordered>
        <Card.Header>
          <XStack space="$2" alignItems="center">
            <MapPin size={24} color="$blue10" />
            <Text fontSize="$6" fontWeight="bold">Current Location</Text>
          </XStack>
        </Card.Header>
        
        <Card.Footer>
          <Button 
            icon={Navigation}
            onPress={() => {/* Handle location update */}}
          >
            Update Location
          </Button>
        </Card.Footer>
      </Card>

      <Card flex={1} elevate bordered>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && <Marker coordinate={location} />}
        </MapView>
      </Card>
    </YStack>
  );
}; 