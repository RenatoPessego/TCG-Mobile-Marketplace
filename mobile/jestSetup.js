// jestSetup.js

import '@testing-library/jest-native/extend-expect';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ base64: 'mockBase64' }]
  }),
  MediaTypeOptions: { Images: 'Images' },
}));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));


jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});
