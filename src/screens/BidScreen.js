import React, { useState } from 'react';
import { YStack, Text, TextInput, Button, Modal, useTheme } from 'tamagui';
import { auth, db } from '../../firebase';
import { addBid } from '../services/database';
import { firebase} from '../firebase';

const BidScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const theme = useTheme();

  const handleBid = async () => {
    const bid = {
      providerId: auth.currentUser.uid,
      providerName: (await db.ref(`profiles/${auth.currentUser.uid}`).once('value')).val().name,
      offer: { min: parseInt(minPrice), max: parseInt(maxPrice) },
      timestamp: new Date().toISOString(),
    };
    await addBid(task.id, bid);
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <YStack padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
        <Text fontSize={20}>{task.profession}</Text>
        <Text>{task.details}</Text>
        <Text>Area: {task.location}</Text>
        <TextInput placeholder="Min Price (R)" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
        <TextInput placeholder="Max Price (R)" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
        <Button onPress={handleBid}>MAKE OFFER</Button>
        <Button onPress={() => navigation.goBack()}>Close</Button>
      </YStack>
    </Modal>
  );
};

export default BidScreen;