import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TaskCard = ({ task, onBid }) => (
  <View style={styles.card}>
    <Text>{task.profession}</Text>
    <Text>{task.details}</Text>
    <Text>{task.location}</Text>
    <Button title="Bid" onPress={onBid} />
  </View>
);

const styles = StyleSheet.create({
  card: { padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5 },
});

export default TaskCard;