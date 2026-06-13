// tests/ChatUserListPage.test.js

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatUserListPage from '../pages/ChatUserListPage';
import { ThemeProvider } from '../components/ThemeContext';

// Mocks
jest.mock('../components/NavBar', () => 'NavBar');
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: { listingId: '123' } }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mocked-token')),
}));

// Reset mocks before each test
beforeEach(() => {
  fetch.resetMocks();
});

describe('ChatUserListPage', () => {
  const renderWithTheme = () =>
    render(
      <ThemeProvider>
        <ChatUserListPage />
      </ThemeProvider>
    );

  it('renders participants correctly', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        participants: [
          {
            _id: '123',
            username: 'Test',
            email: 'Test@example.com',
          },
        ],
      })
    );

    const { findByText } = renderWithTheme();

    expect(await findByText('Username: Test')).toBeTruthy();
    expect(await findByText('Email: Test@example.com')).toBeTruthy();
    expect(await findByText('Open Chat')).toBeTruthy();
  });

  it('renders fallback text if no participants', async () => {
    fetch.mockResponseOnce(JSON.stringify({ participants: [] }));

    const { findByText } = renderWithTheme();

    expect(await findByText('No messages for this listing yet.')).toBeTruthy();
  });
});
