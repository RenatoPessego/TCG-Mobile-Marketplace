import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../pages/LoginPage';
import { ThemeProvider } from '../components/ThemeContext';
import fetchMock from 'jest-fetch-mock';
import { Alert } from 'react-native';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});
jest.mock('../components/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
  ThemeProvider: ({ children }) => children,
}));

beforeAll(() => {
  fetchMock.enableMocks();
});
beforeEach(() => {
  fetchMock.resetMocks();
});

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <LoginPage />
    </ThemeProvider>
  );

describe('LoginPage', () => {
  it('renders login form', () => {
    const { getByPlaceholderText, getByText } = renderWithTheme();

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Back to Welcome Page')).toBeTruthy();
  });

  it('shows alert if fields are empty', () => {
    const { getByText } = renderWithTheme();
    fireEvent.press(getByText('Sign In'));

    expect(Alert.alert).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('logs in successfully with valid credentials', async () => {
    const { getByPlaceholderText, getByText } = renderWithTheme();

    fetchMock.mockResponseOnce(JSON.stringify({ token: 'mock-token' }), {
      status: 200,
    });

    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('shows error alert on login failure', async () => {
    const { getByPlaceholderText, getByText } = renderWithTheme();

    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401 }
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'wronguser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login failed', 'Invalid credentials');
    });
  });

  it('shows error alert on network failure', async () => {
    const { getByPlaceholderText, getByText } = renderWithTheme();

    fetchMock.mockRejectOnce(new Error('Network error'));

    fireEvent.changeText(getByPlaceholderText('Username'), 'user');
    fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Unable to connect to server');
    });
  });
});
