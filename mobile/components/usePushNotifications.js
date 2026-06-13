import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function usePushNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {

    let token;

    if (!Device.isDevice) {
      console.warn('Push Notifications require physical device');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Denied push notification permissions');
        return;
      }

      const tokenObj = await Notifications.getExpoPushTokenAsync();
      token = tokenObj.data;
      const jwt = await AsyncStorage.getItem('authToken');
      console.log('🔑 Token JWT:', jwt);

      if (!jwt) {
        console.warn('⚠️ authToken not found — user not logged in?');
        return;
      }

      const res = await fetch(`${API_URL}/user/pushtoken`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.warn('Error while sending push token:', result.message);
      }
    } catch (err) {
      console.error('General error of notifications:', err);
    }
  }
}
