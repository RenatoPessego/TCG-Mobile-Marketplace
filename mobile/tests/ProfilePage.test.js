import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfilePage from '../pages/ProfilePage';
import { ThemeProvider } from '../components/ThemeContext';

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), replace: jest.fn() }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    if (key === 'authToken') return Promise.resolve('mock-token');
    return Promise.resolve(null);
  }),
  setItem: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn((url) => {
  if (url.endsWith('/auth/profile')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        user: {
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          birthDate: '2000-01-01T00:00:00.000Z',
          balance: 99.99,
          cards: []
        }
      }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  });
});

// Mock NavBar and Animatable
jest.mock('../components/NavBar', () => 'NavBar');
jest.mock('react-native-animatable', () => ({
  Image: 'AnimatableImage',
}));

describe('ProfilePage', () => {
  const renderWithTheme = () =>
    render(
      <ThemeProvider>
        <ProfilePage />
      </ThemeProvider>
    );

  it('renders profile data', async () => {
    const { getByText } = renderWithTheme();

    await waitFor(() => expect(getByText('Test User')).toBeTruthy());

expect(getByText('@testuser')).toBeTruthy();
expect(getByText('test@example.com')).toBeTruthy();
expect(getByText(/Birth:.*2000/)).toBeTruthy(); // regex tolerante
expect(getByText(/Balance:.*99\.99/)).toBeTruthy();
  });
});
