import React, { useEffect, useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { getMarketStyles } from '../styles/marketStyles';
import NavBar from '../components/NavBar';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme();
  const styles = getMarketStyles(isPortrait, darkMode);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market/mylistings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setListings(data.listings);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert('Removed', 'Listing removed.');
      fetchListings();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleUpdate = async () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid price', 'Enter a valid number.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/market/${selectedListing._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEditVisible(false);
      fetchListings();
      Alert.alert('Updated', `Price updated to ${price} 🪙`);
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
        source={{ uri: `https://images.ygoprodeck.com/images/cards/${item.cardId}.jpg` }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardText}>Card Id: {item.cardId}</Text>
        <Text style={styles.cardText}>Rarity: {item.rarity}</Text>
        <Text style={styles.cardText}>Pack: {item.pack}</Text>
        <Text style={styles.cardPrice}>Price: {item.price} 🪙</Text>

        <View style={styles.editActionsRow}>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#FFA500' }]}
            onPress={() => {
              setSelectedListing(item);
              setNewPrice(item.price.toString());
              setEditVisible(true);
            }}
          >
            <Text style={styles.modalButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#555' }]}
            onPress={() =>
              navigation.navigate('ChatUserList', {
                listingId: item._id,
                receiverId: item.buyerId || '',
              })
            }
          >
            <Text style={styles.modalButtonText}>View Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#B22222' }]}
            onPress={() => handleRemove(item._id)}
          >
            <Text style={styles.modalButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />
        <Text style={styles.title}>📦 My Listings</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2894B0" style={styles.activityIndicator} />
        ) : listings.length === 0 ? (
          <Text style={styles.noCardsText}>You have no active listings.</Text>
        ) : (
          <FlatList
            data={listings}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cardList}
          />
        )}

        {/* Modal to Edit Price */}
        <Modal visible={editVisible} transparent animationType="fade">
          <View style={[styles.modalOverlay, { backgroundColor: darkMode ? '#000000aa' : '#ffffffdd' }]}>
            <View style={[styles.modalContent, { backgroundColor: darkMode ? '#222' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>Edit Price</Text>
              <Text style={[styles.cardText, { color: darkMode ? '#ccc' : '#333' }]}>
                New price for listing: "{selectedListing?.cardId}"
              </Text>
              <TextInput
                value={newPrice}
                onChangeText={setNewPrice}
                keyboardType="numeric"
                placeholder="Ex: 5.00"
                placeholderTextColor={darkMode ? '#888' : '#999'}
                style={[styles.priceInput, { color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#555' : '#ccc' }]}
              />
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  onPress={() => setEditVisible(false)}
                  style={[styles.modalButton, { backgroundColor: '#999' }]}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={[styles.modalButton, { backgroundColor: '#2894B0' }]}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
