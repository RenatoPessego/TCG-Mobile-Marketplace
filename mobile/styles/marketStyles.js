import { StyleSheet } from 'react-native';

// Accepts both orientation and dark mode flag
export const getMarketStyles = (isPortrait, darkMode = false) =>
  StyleSheet.create({
    // Main screen container
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#F3F8FF',
    },

    // Screen title
    title: {
      fontSize: isPortrait ? 24 : 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
      color: darkMode ? '#fff' : '#333',
    },

    // Scroll container for card list
    cardList: {
      paddingHorizontal: isPortrait ? 16 : 32,
      paddingBottom: 20,
    },

    // Individual card wrapper
    cardContainer: {
      flexDirection: 'row',
      backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
      borderRadius: 12,
      marginBottom: 12,
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },

    // Card image thumbnail
    cardImage: {
      width: 90,
      height: 130,
      borderRadius: 8,
      marginRight: 10,
    },

    // Wrapper for card text and buttons
    cardInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },

    // Card description text
    cardText: {
      fontSize: 14,
      marginBottom: 4,
      color: darkMode ? '#ccc' : '#444',
    },

    // Card price text
    cardPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2894B0',
      marginBottom: 8,
    },

    // Buy button (blue)
    buyButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },

    buyButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
    },

    // Sell button (green)
    sellButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 6,
    },

    sellButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
    },

    // Input for setting price
    priceInput: {
      borderColor: darkMode ? '#666' : '#CCC',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginTop: 6,
      fontSize: 14,
      backgroundColor: darkMode ? '#2C2C2C' : '#FFF',
      color: darkMode ? '#fff' : '#000',
    },

    // Fallback text when no cards
    noCardsText: {
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
      color: darkMode ? '#aaa' : '#888',
    },

    // Loading indicator style
    activityIndicator: {
      marginTop: 40,
    },

    // Modal background overlay
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Modal content container
    modalContent: {
      padding: 20,
      backgroundColor: darkMode ? '#1E1E1E' : 'white',
      borderRadius: 8,
      width: '80%',
    },

    // Modal title
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },

    // Modal action button
    modalButton: {
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      flex: 1,
      marginHorizontal: 5,
    },

    // Modal button label
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      allignSelf: 'center',
      alignContent: 'center',
      fontSize:12
    },

    // Container for edit/delete buttons
    editActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    // Back button above list
    backButton: {
      margin: 10,
    },

    // Text of back button
    backButtonText: {
      color: '#2894B0',
      fontWeight: 'bold',
      fontSize: 16,
    },

    // Button to view listings
    viewListingsButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 15,
      marginTop: 5,
    },

    // View listings button text
    viewListingsText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });
