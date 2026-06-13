// tests/RegisterPage.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterPage from '../pages/RegisterPage';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: jest.fn() }),
}));

jest.mock('../components/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ base64: 'mocked-image-data' }],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images'
  }
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn((uri, actions, options) =>
    Promise.resolve({ uri: 'mocked-uri', base64: 'mocked-base64' })
  ),
  SaveFormat: { JPEG: 'jpeg' }
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 201,
    json: () => Promise.resolve({ token: 'mocked-token' }),
  })
);

jest.spyOn(Alert, 'alert');

describe('RegisterPage', () => {
  const renderWithTheme = () => render(<RegisterPage />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validates required fields and prevents submission with missing info', async () => {
    const { getByText } = renderWithTheme();
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please fill all required fields');
    });
  });

  test('shows password mismatch alert', async () => {
    const { getByPlaceholderText, getByText, toJSON } = renderWithTheme();

    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'SecurePass123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'WrongPass123!');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  test('uploads image when chosen', async () => {
    const { getByText } = renderWithTheme();
    fireEvent.press(getByText('Upload Profile Image'));

    await waitFor(() => {
      expect(getByText('Change Profile Image')).toBeTruthy();
    });
  });

  test('submits valid form and does not trigger age error', async () => {
    const { getByPlaceholderText, getByText, getByTestId, toJSON } = renderWithTheme();

    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'SecurePass123!');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'SecurePass123!');

    // Mock of method `toISOString()` to force a specific value
    fireEvent.press(getByText(/Birth Date:/i));

    const picker = await waitFor(() => getByTestId('birthDatePicker'));
    fireEvent(picker, 'onChange', { type: 'set', nativeEvent: { timestamp: new Date('2004-02-27').getTime() } }, new Date('2004-02-27'));

    console.log(toJSON());
    // Submits
    console.log(getByTestId('TextBirth').props.children);

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'mocked-token');
    });
  });
});