import React, { useState, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { YStack, Text, ScrollView, Card, Button, XStack, Image, useTheme } from 'tamagui';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  limit,
  startAfter,
  serverTimestamp 
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { LoadingSpinner } from '../components/LoadingSpinner';

const LiveAdsScreen = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const ITEMS_PER_PAGE = 10;

  const loadAds = async (isRefresh = false) => {
    try {
      let adsQuery = query(
        collection(db, 'ads'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      if (!isRefresh && lastVisible) {
        adsQuery = query(
          collection(db, 'ads'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(adsQuery);
      
      if (snapshot.empty) {
        if (isRefresh) setAds([]);
        return;
      }

      const adsData = [];
      for (const doc of snapshot.docs) {
        const adData = doc.data();
        // Get user data for each ad
        const userDoc = await getDoc(doc(db, 'users', adData.userId));
        adsData.push({
          id: doc.id,
          ...adData,
          user: userDoc.data()
        });
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      
      if (isRefresh) {
        setAds(adsData);
      } else {
        setAds(prevAds => [...prevAds, ...adsData]);
      }
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLastVisible(null);
    await loadAds(true);
  };

  const handleLoadMore = () => {
    if (!loading && lastVisible) {
      loadAds();
    }
  };

  useEffect(() => {
    loadAds(true);
  }, []);

  const handleCreateAd = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }

    // Check user's subscription status
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (userData?.subscriptionStatus !== 'active') {
      navigation.navigate('Subscription');
      return;
    }

    navigation.navigate('CreateAd');
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isCloseToBottom) {
          handleLoadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      <YStack padding="$4" space="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold">Live Ads</Text>
          <Button onPress={handleCreateAd} theme="active">
            Create Ad
          </Button>
        </XStack>

        {ads.length === 0 ? (
          <Card padding="$4" marginTop="$4">
            <Text textAlign="center">No active ads found</Text>
          </Card>
        ) : (
          ads.map(ad => (
            <Card
              key={ad.id}
              padding="$4"
              pressStyle={{ scale: 0.98 }}
              onPress={() => navigation.navigate('AdDetails', { adId: ad.id })}
            >
              <YStack space="$2">
                <XStack space="$3" alignItems="center">
                  <Image
                    source={{ uri: ad.user?.profileImage || 'https://placeholder.com/50' }}
                    width={50}
                    height={50}
                    borderRadius={25}
                  />
                  <YStack>
                    <Text fontWeight="bold">{ad.title}</Text>
                    <Text color="$gray10">{ad.user?.name}</Text>
                  </YStack>
                </XStack>
                <Text numberOfLines={2}>{ad.description}</Text>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray10">
                    {new Date(ad.createdAt?.toDate()).toLocaleDateString()}
                  </Text>
                  <Text fontWeight="bold" color={theme.primary.val}>
                    ${ad.budget}
                  </Text>
                </XStack>
              </YStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
};

export default LiveAdsScreen;