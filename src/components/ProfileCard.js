import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileCard = ({ profile, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.name}>{profile.name}</Text>
    <Text>{profile.occupation}</Text>
    <Text>{profile.location}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5, backgroundColor: '#f9f9f9' },
  name: { fontSize: 18, fontWeight: 'bold' },
});

export default ProfileCard;