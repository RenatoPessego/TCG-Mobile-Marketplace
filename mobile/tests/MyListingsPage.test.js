// tests/MyListingsPage.test.js

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyListingsPage from '../pages/MyListingsPage';
import { ThemeProvider } from '../components/ThemeContext';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('dummy-token')),
}));

jest.mock('../components/NavBar', () => 'NavBar');

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

global.fetch = jest.fn();

const mockListings = [
  {
    _id: '1',
    cardId: '123',
    rarity: 'Ultra Rare',
    pack: 'Legends Pack',
    price: 10,
    sellerId: { username: 'User123' }
  }
];

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <MyListingsPage />
    </ThemeProvider>
  );

describe('MyListingsPage', () => {
  beforeEach(() => {
    fetch.mockReset();
    Alert.alert.mockClear();
  });

  it('renders listing and responds to button presses', async () => {
    // 1st call: fetchListings
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ listings: mockListings }),
    });

    // 2nd call: remove listing
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Removed' }),
    });

    const { findByText, getByText } = renderWithTheme();

    // Wait for data to load
    expect(await findByText('Card Id: 123')).toBeTruthy();

    // Press buttons
    fireEvent.press(getByText('Edit'));
    fireEvent.press(getByText('Cancel'));
    fireEvent.press(getByText('View Chats'));
    fireEvent.press(getByText('Remove'));

    // Wait for Alert to be called
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
