import { StyleSheet } from 'react-native';

// Accepts both orientation and theme mode
export const getProfileStyles = (isPortrait, darkMode = false) =>
  StyleSheet.create({
    // Main container of profile screen
    container: {
      padding: isPortrait ? 10 : 20,
      paddingBottom: 100,
      alignItems: 'center',
    },

    // Loading and error fallback containers
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#121212' : '#fff',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#121212' : '#fff',
    },

    // Profile picture
    avatar: {
      width: isPortrait ? 100 : 120,
      height: isPortrait ? 100 : 120,
      borderRadius: 60,
      marginVertical: 10,
      alignSelf: 'center',
    },

    // Profile name and basic info
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
      color: darkMode ? '#fff' : '#000',
      alignSelf: 'center',
    },
    username: {
      fontSize: 16,
      color: darkMode ? '#aaa' : '#888',
      alignSelf: 'center',
    },
    email: {
      fontSize: 16,
      color: darkMode ? '#ccc' : '#444',
      marginTop: 4,
      alignSelf: 'center',
    },
    birthDate: {
      fontSize: 16,
      color: darkMode ? '#ccc' : '#444',
      marginTop: 4,
      alignSelf: 'center',
    },
    balance: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2894B0',
      marginTop: 10,
      marginBottom: 20,
      alignSelf: 'center',
      allignItems: 'center',
    },

    // Section titles like "Your Cards"
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },

    // Grid card display
    cardBox: {
      width: '30%',
      margin: '1.5%',
      alignItems: 'center',
      backgroundColor: darkMode ? '#2A2A2A' : '#f2f2f2',
      borderRadius: 8,
      padding: 5,
      elevation: 2,
    },
    cardImage: {
      width: 80,
      height: 110,
      resizeMode: 'contain',
    },
    cardName: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',  
      marginTop: 4,
      color: darkMode ? '#fff' : '#000',
    },
    cardQty: {
      fontSize: 12,
      color: darkMode ? '#ccc' : '#555',
    },

    // Pagination control
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    pageButton: {
      fontSize: 20,
      paddingHorizontal: 15,
      color: '#2894B0',
    },
    pageNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#000',
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '95%',
      maxHeight: '90%',
      backgroundColor: darkMode ? '#1E1E1E' : '#fff',
      borderRadius: 12,
      padding: 15,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 2,
    },
    modalImage: {
      width: '65%',
      aspectRatio: 0.7,
      resizeMode: 'contain',
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: darkMode ? '#fff' : '#000',
    },
    modalText: {
      fontSize: 14,
      marginVertical: 4,
      textAlign: 'left',
      paddingHorizontal: 12,
      color: darkMode ? '#eee' : '#000',
    },
    modalDesc: {
      fontSize: 13,
      color: darkMode ? '#ccc' : '#333',
      paddingHorizontal: 12,
      marginTop: 10,
      textAlign: 'center',
    },
    modalSubtitle: {
      color: '#2894B0',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    // Sell buttons
    quickSellButton: {
      backgroundColor: '#2894B0',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginRight: 10,
    },
    quickSellButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    marketSellButton: {
      backgroundColor: darkMode ? '#444' : '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    marketSellButtonText: {
      color: darkMode ? '#fff' : '#333',
      fontWeight: 'bold',
    },

    // Input for setting price
    inputPrice: {
      borderWidth: 1,
      borderColor: darkMode ? '#666' : '#ccc',
      borderRadius: 6,
      padding: 10,
      marginBottom: 15,
      width: '100%',
      color: darkMode ? '#fff' : '#000',
      backgroundColor: darkMode ? '#2C2C2C' : '#fff',
    },

    // Button row inside modal
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      padding: 10,
      borderRadius: 6,
    },
    modalButtonCancel: {
      backgroundColor: darkMode ? '#777' : '#999',
    },
    modalButtonConfirm: {
      backgroundColor: '#2894B0',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
