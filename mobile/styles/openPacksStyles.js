import { StyleSheet, Dimensions } from 'react-native';

// Returns style object based on orientation and theme mode
export const getOpenPacksStyles = (isPortrait, darkMode = false, width = 400, height = 800) => {
  return StyleSheet.create({
    // Page container background
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#E0F7FA',
    },

    // ScrollView content padding
    content: {
      flexGrow: 1,
      padding: isPortrait ? 16 : 32,
      justifyContent: 'flex-start',
    },

    // Header title
    title: {
      fontSize: isPortrait ? 22 : 22,
      fontWeight: 'bold',
      marginBottom: 0,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },

    // Label above each Picker
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
      marginTop: 8,
      color: darkMode ? '#ccc' : '#333',
    },

    // Picker wrapper container
    pickerContainer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#fff',
      borderRadius: 10,
      elevation: 2,
      marginBottom: 8,
      overflow: 'hidden',
    },

    // Native Picker style
    picker: {
      height: 60,
      width: '100%',
      color: darkMode ? '#fff' : '#333',
      
      fontSize: 16,
      paddingVertical: 12,
      justifyContent: 'center',
    },

    // Generate button styling
    generateButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: 'center',
      borderRadius: 10,
      marginTop: 16,
    },

    // Generate button text
    generateButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },

    // Container for displaying the pack preview
    largePack: {
      marginTop: 30,
      alignItems: 'center',
    },

    // Image of the pack
    packImage: {
      width: isPortrait ? 140 : 160,
      height: isPortrait ? 200 : 230,
      marginBottom: 10,
      resizeMode: 'contain',
    },

    // Pack title
    packTitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
      color: darkMode ? '#fff' : '#000',
    },

    // Pack price text
    packPrice: {
      fontSize: 16,
      color: darkMode ? '#bbb' : '#555',
      marginBottom: 4,
    },

    // "Open" button
    openButton: {
      backgroundColor: '#28A745',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
    },

    // "Open" button text
    openButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },

    // Overlay that shows the opened card fullscreen
    cardReveal: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? 'rgba(18,18,18,0.97)' : 'rgba(255, 255, 255, 0.97)',
      padding: 20,
      zIndex: 100,
    },

    // Button to close the reveal overlay
    closeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      padding: 5,
      zIndex: 101,
    },

    // Close icon (✖)
    closeText: {
      fontSize: 28,
      color: darkMode ? '#fff' : '#333',
    },

    // "✨ You got:" title
    revealTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },

    // Image of the card
    cardImage: {
      width: width * 0.5,
      height: height * 0.4,
      resizeMode: 'contain',
      marginBottom: 10,
    },

    // Card name
    cardName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },

    // Card rarity
    cardRarity: {
      fontSize: 16,
      color: darkMode ? '#ccc' : '#555',
      marginBottom: 10,
      textAlign: 'center',
    },

    // Navigation arrows (◀ ▶)
    navigationButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },

    // Arrow icon style
    arrow: {
      fontSize: 24,
      color: darkMode ? '#ccc' : '#444',
      paddingHorizontal: 20,
    },

    // Index text "1 / 5"
    indexText: {
      fontSize: 16,
      fontWeight: '500',
      color: darkMode ? '#fff' : '#000',
    },

    // Loading spinner
    loadingIndicator: {
      marginTop: 20,
    },

    // Hidden image used to preload
    preloadImage: {
      width: 0,
      height: 0,
      position: 'absolute',
    },
    
  });
};
