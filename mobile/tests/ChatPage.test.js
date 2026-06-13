import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatPage from '../pages/ChatPage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import fetchMock from 'jest-fetch-mock';
import { ThemeProvider } from '../components/ThemeContext'; // se usares ThemeContext

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      listingId: '123',
      receiverId: '456',
    },
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('dummy-token')),
}));

// Enable fetch mocking
beforeAll(() => {
  global.fetch = fetchMock;
});

afterEach(() => {
  fetchMock.resetMocks();
});

const renderWithTheme = () => {
  return render(
    <ThemeProvider>
      <ChatPage />
    </ThemeProvider>
  );
};

describe('ChatPage', () => {
  it('renders title and input', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ messages: [] }) // mock empty messages
    );

    const { getByText, getByPlaceholderText } = renderWithTheme();

    await waitFor(() => {
      expect(getByText('💬 Chat')).toBeTruthy();
      expect(getByPlaceholderText('Type a message...')).toBeTruthy();
      expect(getByText('Send')).toBeTruthy();
    });
  });

  it('sends a message when Send is pressed', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ messages: [] })); // load messages
    const { getByPlaceholderText, getByText } = renderWithTheme();

    await waitFor(() => {
      expect(getByText('Send')).toBeTruthy();
    });

    const input = getByPlaceholderText('Type a message...');
    fireEvent.changeText(input, 'Hello world');

    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { text: 'Hello world', senderId: 'me' } })
    );

    const sendButton = getByText('Send');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/messages'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});
