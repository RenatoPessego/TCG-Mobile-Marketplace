import React, { useEffect, useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { getMarketStyles } from '../styles/marketStyles';
import NavBar from '../components/NavBar';

const TCG_LOCATIONS = [
  { name: 'Lisbon', lat: 38.7369, lng: -9.1399, radius: 6.0 },
  { name: 'Maribor', lat: 46.5547, lng: 15.6459, radius: 7.0 },
  { name: 'Ljubjana', lat: 40.0569, lng: 14.5058, radius: 7.0 },
  { name: 'Munich', lat: 48.1351, lng: 11.5820, radius: 10.0 },
  { name: 'Paris', lat: 48.8575, lng: 2.3514, radius: 6.0 },
  { name: 'Madrid', lat: 40.4167, lng: 3.7033, radius: 14.0 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, radius: 30.0 },
  { name: 'Tokyo', lat: 35.6764, lng: 139.6500, radius: 27.0 }
];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyLocationBonus() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme();
  const styles = getMarketStyles(isPortrait, darkMode);
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [nearbyStore, setNearbyStore] = useState(null);
  const [rewardMessage, setRewardMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required for this feature.');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });

      for (let store of TCG_LOCATIONS) {
        const distance = getDistanceFromLatLonInKm(latitude, longitude, store.lat, store.lng);
        if (distance <= store.radius) {
          setNearbyStore(store.name);
          break;
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Location error:', err);
      setLoading(false);
    }
  };

  const claimBonus = async () => {
    if (!nearbyStore || claimed) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/user/checkin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: nearbyStore })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRewardMessage(data.message || 'Check-in successful!');
      setClaimed(true);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.title}>📍 Location Check-In</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2894B0" style={{ marginTop: 40 }} />
        ) : nearbyStore ? (
          <>
            <Text style={styles.cardText}>🎯 You’re near {nearbyStore}!</Text>
            <TouchableOpacity
              onPress={claimBonus}
              style={[styles.buyButton, claimed && { backgroundColor: '#aaa' }]}
              disabled={claimed}
            >
              <Text style={styles.buyButtonText}>
                {claimed ? '✔️ Bonus claimed' : '🎁 Claim your bonus'}
              </Text>
            </TouchableOpacity>
            {rewardMessage !== '' && (
              <Text style={[styles.cardText, { marginTop: 15 }]}>{rewardMessage}</Text>
            )}
          </>
        ) : (
          <Text style={styles.cardText}>ℹ️ You’re not near any known TCG store.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
