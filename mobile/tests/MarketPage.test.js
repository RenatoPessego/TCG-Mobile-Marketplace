import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MarketPage from '../pages/MarketPage';
import { ThemeProvider } from '../components/ThemeContext';
import fetchMock from 'jest-fetch-mock';
import { useNavigation } from '@react-navigation/native';

//  Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

//  Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('dummy-token')),
}));

//  Mock NavBar to avoid external fetches
jest.mock('../components/NavBar', () => () => <></>);

// Enable fetch mocking
beforeAll(() => {
  global.fetch = fetchMock;
});

afterEach(() => {
  fetchMock.resetMocks();
});

//  Simulated data for testing
const mockListings = [
  {
    _id: '1',
    cardId: '123',
    rarity: 'Ultra Rare',
    pack: 'Starter Pack',
    price: 100,
    sellerId: {
      _id: 'abc123',
      username: 'CardSeller',
    },
  },
];

const renderWithTheme = () => {
  return render(
    <ThemeProvider>
      <MarketPage />
    </ThemeProvider>
  );
};

describe('MarketPage', () => {
  it('renders listings and handles buy/chat actions', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ listings: mockListings }));

    const { findByText, getByText } = renderWithTheme();

    // Check if data is being fetched
    expect(await findByText('Card Id: 123')).toBeTruthy();
    expect(getByText('Seller: CardSeller')).toBeTruthy();

    // Mock POST response
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    fireEvent.press(getByText('Buy'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/market/buy/1'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
