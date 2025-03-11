import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import { auth, db } from '../firebase';
import { firebase} from '../firebase';
import { signOut } from '../services/auth';

const images = [
  require('../../assets/longo.png'),
  require('../../assets/longo.png'),
  require('../../assets/longo.png'),
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    db.collection('profiles').get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfiles(data.filter((p) => p.occupation));
    });
    const interval = setInterval(() => setCurrentImage((prev) => (prev + 1) % images.length), 13000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const renderProfile = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Bid', { profile: item })}>
      <Card containerStyle={styles.profileCard}>
        <View style={styles.profileContent}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{item.name}</Text>
            <Text style={styles.profileOccupation}>{item.occupation}</Text>
            <View style={styles.locationContainer}>
              <Icon name="location-pin" type="material" size={16} color="#666" />
              <Text style={styles.profileLocation}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={styles.profilePoints}>{item.points}</Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchButton}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" type="material" color="#000" size={24} />
          <Text style={styles.searchText}>Who do you need?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={images[currentImage]} style={styles.image} />
      </View>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
        style={styles.profileList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchButton: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 25,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileList: {
    padding: 16,
  },
  profileCard: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  profileOccupation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  pointsContainer: {
    backgroundColor: '#EAAA00',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  profilePoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#000000',
  },
});

export default HomeScreen;