import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NearbyLocationBonus from '../pages/NearbyLocationBonus';
import { ThemeProvider } from '../components/ThemeContext';
import * as Location from 'expo-location';
import fetchMock from 'jest-fetch-mock';
import { Alert } from 'react-native';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({ navigate: jest.fn() }),
  };
});

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <NearbyLocationBonus />
    </ThemeProvider>
  );

describe('NearbyLocationBonus', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('shows bonus claim button and triggers reward flow', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 38.7369, longitude: -9.1399 }, // near Lisbon
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'You claimed 100 coins!' })
    );

    const { findByText, getByText } = renderWithTheme();

    const locationText = await findByText("🎯 You’re near Lisbon!");
    expect(locationText).toBeTruthy();

    fireEvent.press(getByText('🎁 Claim your bonus'));

    const rewardMessage = await findByText('You claimed 100 coins!');
    expect(rewardMessage).toBeTruthy();
  });

  it('shows fallback if not near any location', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 0, longitude: 0 }, // nowhere
    });

    const { findByText } = renderWithTheme();

    const infoText = await findByText('ℹ️ You’re not near any known TCG store.');
    expect(infoText).toBeTruthy();
  });
});
