import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomePage from '../pages/WelcomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import OpenPacksPage from '../pages/OpenPacksPage';
import MarketPage from '../pages/MarketPage';
import SellCardPage from '../pages/SellCardPage';
import MyListingsPage from '../pages/MyListingsPage';
import ChatPage from '../pages/ChatPage';
import ChatUserListPage from '../pages/ChatUserListPage';
import NearbyLocationBonus from '../pages/NearbyLocationBonus';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Home" component={HomePage} /> 
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="OpenPacks" component={OpenPacksPage} />
        <Stack.Screen name="Market" component={MarketPage} />
        <Stack.Screen name="SellCard" component={SellCardPage} />
        <Stack.Screen name="MyListings" component={MyListingsPage} />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="ChatUserList" component={ChatUserListPage} />
        <Stack.Screen name="NearbyLocation" component={NearbyLocationBonus} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
