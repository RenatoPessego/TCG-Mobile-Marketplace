import React, { useEffect, useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { getMarketStyles } from '../styles/marketStyles';
import NavBar from '../components/NavBar';

export default function MarketPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme();
  const styles = getMarketStyles(isPortrait, darkMode);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching market');
      setListings(data.listings);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_URL}/market/buy/${listingId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error buying card');
      Alert.alert('Success', 'Card purchased!');
      fetchListings(); // refresh
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{
          uri: `https://images.ygoprodeck.com/images/cards/${item.cardId}.jpg`,
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardText}>Card ID: {item.cardId}</Text>
        <Text style={styles.cardText}>Rarity: {item.rarity}</Text>
        <Text style={styles.cardText}>Pack: {item.pack}</Text>
        <Text style={styles.cardText}>
          Seller: {item.sellerId?.username || 'Unknown'}
        </Text>
        <Text style={styles.cardPrice}>{item.price} 🪙</Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleBuy(item._id)}
        >
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: '#555', marginTop: 6 }]}
          onPress={() =>
            navigation.navigate('Chat', {
              listingId: item._id,
              receiverId: item.sellerId?._id,
            })
          }
        >
          <Text style={styles.buyButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />
        <Text style={styles.title}>🛒 Market</Text>
        {loading ? (
          <ActivityIndicator
            testID="ActivityIndicator"
            size="large"
            color="#2894B0"
            style={styles.activityIndicator}
          />
        ) : listings.length === 0 ? (
          <Text style={styles.noCardsText}>No cards for sale.</Text>
        ) : (
          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cardList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
