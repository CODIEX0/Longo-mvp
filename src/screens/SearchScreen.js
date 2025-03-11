import React, { useState } from 'react';
import { YStack, Text, TextInput, Button, FlatList, Modal, useTheme } from 'tamagui';
import { auth, db } from '../../firebase';
import { createTask, searchProfiles } from '../services/database';
import { Icon } from 'react-native-elements';
import { firebase} from '../firebase';

const SearchScreen = ({ navigation }) => {
  const theme = useTheme();
  const [profession, setProfession] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleFind = async () => {
    const task = {
      profession,
      details,
      location,
      requesterId: auth.currentUser.uid,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const ref = await createTask(task);
    setModalVisible(false);
    db.ref('profiles')
      .orderByChild('occupation')
      .equalTo(profession)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((doc) =>
          db.ref('notifications').push({
            userId: doc.key,
            message: `New task: ${profession} in ${location}`,
            taskId: ref,
          })
        );
      });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const searchResults = await searchProfiles(query);
      setResults(searchResults);
    }
  };

  return (
    <YStack flex={1} padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
      <YStack flexDirection="row" alignItems="center" backgroundColor="#FFFFFF" padding="$2" borderRadius={25}>
        <Icon name="search" type="material" color="#666" size={24} />
        <TextInput
          style={{ flex: 1, marginLeft: 10 }}
          placeholder="Search for services..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </YStack>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <YStack padding="$2" backgroundColor="#FFFFFF" borderRadius={8}>
            <Text>{item.name}</Text>
          </YStack>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <YStack padding="$4" backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}>
          <Text>Who Do You Need?</Text>
          <TextInput placeholder="Profession (e.g., Plumber)" value={profession} onChangeText={setProfession} />
          <TextInput placeholder="Why do you need them?" value={details} onChangeText={setDetails} />
          <TextInput placeholder="Location (e.g., Randburg)" value={location} onChangeText={setLocation} />
          <Button onPress={handleFind}>FIND</Button>
          <Button onPress={() => navigation.goBack()}>Close</Button>
        </YStack>
      </Modal>
    </YStack>
  );
};

export default SearchScreen;