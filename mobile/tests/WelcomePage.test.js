import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomePage from '../pages/WelcomePage';

jest.mock('../components/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false }),
}));

describe('WelcomePage', () => {
  const mockNavigate = jest.fn();

  const renderPage = () =>
    render(<WelcomePage navigation={{ navigate: mockNavigate }} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login and register buttons', () => {
    const { getByText } = renderPage();
    expect(getByText('LOGIN')).toBeTruthy();
    expect(getByText('REGISTER')).toBeTruthy();
  });

  test('navigates to Login page when LOGIN is pressed', () => {
    const { getByText } = renderPage();
    fireEvent.press(getByText('LOGIN'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  test('navigates to Register page when REGISTER is pressed', () => {
    const { getByText } = renderPage();
    fireEvent.press(getByText('REGISTER'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});
