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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import usePushNotifications from '../components/usePushNotifications';
import { API_URL } from '../config';
import NavBar from '../components/NavBar';
import { getHomeStyles } from '../styles/homeStyles';

export default function HomePage() {
  usePushNotifications();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme();
  const styles = getHomeStyles(isPortrait, darkMode);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Not authenticated');
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        Alert.alert('Error', data.message || 'Unauthorized');
      }
    } catch (err) {
      Alert.alert('Error', 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator testID="ActivityIndicator" size="large" color="#2894B0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.notAuth}>
        <Text>You are not logged in.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>
          <Text style={styles.subText}>You are logged in.</Text>

          <TouchableOpacity
            style={styles.openPackButton}
            onPress={() => navigation.navigate('OpenPacks')}
          >
            <Text style={styles.openPackButtonText}>🎁 Open Packs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
