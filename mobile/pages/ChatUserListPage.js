import React, { useEffect, useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '../config';
import { getMarketStyles } from '../styles/marketStyles';
import NavBar from '../components/NavBar';

export default function ChatUserListPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { listingId } = route.params;

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme();
  const styles = getMarketStyles(isPortrait, darkMode);

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/messages/participants/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setParticipants(data.participants);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardText}>Username: {item.username}</Text>
        <Text style={styles.cardText}>Email: {item.email}</Text>
        <TouchableOpacity
          style={[styles.buyButton, { marginTop: 10 }]}
          onPress={() =>
            navigation.navigate('Chat', {
              listingId,
              receiverId: item._id,
              backTo: 'ChatUserList'
            })
          }
        >
          <Text style={styles.buyButtonText}>Open Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to My Listings</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👥 Conversations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 40 }} />
        ) : participants.length === 0 ? (
          <Text style={styles.noCardsText}>No messages for this listing yet.</Text>
        ) : (
          <FlatList
            data={participants}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.cardList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
