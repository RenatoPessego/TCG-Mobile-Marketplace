// tests/SellCardPage.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SellCardPage from '../pages/SellCardPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('../components/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

jest.mock('../components/NavBar', () => 'NavBar');

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

const mockCard = {
  id: '123456',
  rarity: 'Ultra Rare',
  pack: 'Starter Deck',
  quantity: 1,
  name: 'Dark Magician',
  desc: 'A powerful wizard.',
  price: '5.00',
  image_url: 'https://example.com/image.jpg'
};

describe('SellCardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () => render(<SellCardPage />);

  test('shows loading initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('mocked-token');
    global.fetch = jest.fn(() =>
      new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => ({ cards: [] }) }), 500))
    );
    renderPage();
  });

  test('shows error if fetch fails', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('mocked-token');
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    renderPage();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
    });
  });

  test('shows "no cards" text when user has no cards', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('mocked-token');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: [] }),
      })
    );

    const { getByText } = renderPage();
    await waitFor(() => expect(getByText('You have no cards to sell.')).toBeTruthy());
  });

  test('prevents selling card with invalid price', async () => {
    AsyncStorage.getItem.mockImplementation((key) =>
      key.startsWith('card_') ? Promise.resolve(JSON.stringify(mockCard)) : Promise.resolve('mocked-token')
    );

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: [{ id: mockCard.id, rarity: mockCard.rarity, pack: mockCard.pack, quantity: 1 }] }),
      })
    );

    const { getByPlaceholderText, getByText } = renderPage();

    await waitFor(() => expect(getByText('Sell')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('Set price'), '-5');
    fireEvent.press(getByText('Sell'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Invalid Price', 'Please enter a valid price.');
    });
  });

  test('allows valid selling and shows success alert', async () => {
    AsyncStorage.getItem.mockImplementation((key) =>
      key.startsWith('card_') ? Promise.resolve(JSON.stringify(mockCard)) : Promise.resolve('mocked-token')
    );

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              cards: [{ id: mockCard.id, rarity: mockCard.rarity, pack: mockCard.pack, quantity: 1 }],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' }),
        })
      );

    const { getByPlaceholderText, getByText } = renderPage();

    await waitFor(() => expect(getByText('Sell')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('Set price'), '10');
    fireEvent.press(getByText('Sell'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Card listed for sale!');
    });
  });
});
