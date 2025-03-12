import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Avatar, Sheet, Input } from 'tamagui';
import { DollarSign, Clock, MapPin, MessageCircle } from '@tamagui/lucide-icons';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const BidScreen = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidSheet, setShowBidSheet] = useState(false);
  const navigation = useNavigation();

  const handleSubmitBid = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await addDoc(collection(db, 'bids'), {
        userId: user.uid,
        projectId: navigation.getState().routes[navigation.getState().index].params.projectId,
        amount: parseFloat(bidAmount),
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      setShowBidSheet(false);
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        {/* Project Details */}
        <Card bordered padding="$4">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">Website Development Project</Text>
            <Text color="$gray9">Looking for an experienced developer to create a responsive website...</Text>
            
            <XStack space="$4">
              <XStack space="$2" alignItems="center">
                <DollarSign size={18} />
                <Text>$1000-$2000</Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Clock size={18} />
                <Text>2 weeks</Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* Client Info */}
        <Card bordered padding="$4">
          <XStack space="$3" alignItems="center">
            <Avatar circular size="$6" />
            <YStack>
              <Text fontSize="$4" fontWeight="500">Client Name</Text>
              <Text color="$gray9">Project Owner</Text>
            </YStack>
            <Button marginLeft="auto" icon={MessageCircle}>Chat</Button>
          </XStack>
        </Card>

        {/* Bid Button */}
        <Button 
          size="$5" 
          theme="active"
          onPress={() => setShowBidSheet(true)}
        >
          Place Bid
        </Button>

        {/* Bid Sheet */}
        <Sheet
          modal
          open={showBidSheet}
          onOpenChange={setShowBidSheet}
          snapPoints={[50]}
        >
          <Sheet.Frame padding="$4">
            <YStack space="$4">
              <Text fontSize="$6" fontWeight="bold">Place Your Bid</Text>
              <Input
                placeholder="Enter bid amount"
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
                icon={DollarSign}
              />
              <Button size="$5" theme="active" onPress={handleSubmitBid}>Submit Bid</Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </ScrollView>
  );
};

export default BidScreen;