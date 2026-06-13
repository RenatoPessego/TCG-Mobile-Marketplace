import { StyleSheet } from 'react-native';

// Accepts both orientation and theme mode (darkMode)
export const getHomeStyles = (isPortrait, darkMode = false) =>
  StyleSheet.create({
    // Main container background
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#E0F7FA',
    },

    // Container for home screen content
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isPortrait ? 16 : 32,
    },

    // Main welcome title
    welcomeText: {
      fontSize: isPortrait ? 24 : 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: darkMode ? '#fff' : '#000',
      textAlign: 'center',
    },

    // Subtitle text below welcome
    subText: {
      fontSize: 16,
      color: darkMode ? '#ccc' : '#666',
      textAlign: 'center',
    },

    // Centered loading state
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#121212' : '#E0F7FA',
    },

    // Fallback for unauthenticated users
    notAuth: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#121212' : '#E0F7FA',
    },

    // Button to open a new pack
    openPackButton: {
      marginTop: 30,
      backgroundColor: darkMode ? '#1E88E5' : '#2894B0',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignSelf: 'center',
    },

    // Text inside the open pack button
    openPackButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
  });
