import { StyleSheet } from 'react-native';

// Accepts both orientation and theme mode (darkMode)
export const getChatStyles = (isPortrait, darkMode = false) =>
  StyleSheet.create({
    // Main container of the chat screen
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#F3F8FF',
      paddingHorizontal: 10,
      paddingTop: isPortrait ? 20 : 10,
    },

    // Title at the top of the chat
    title: {
      fontSize: isPortrait ? 24 : 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: isPortrait ? 10 : 5,
      color: darkMode ? '#fff' : '#333',
    },

    // Back button position
    backButton: {
      marginLeft: 15,
      marginBottom: 10,
    },

    // Back button label
    backText: {
      color: darkMode ? '#90CAF9' : '#2894B0',
      fontWeight: 'bold',
      fontSize: 16,
    },

    // Left-aligned message bubble (received)
    messageBubbleLeft: {
      alignSelf: 'flex-start',
      backgroundColor: darkMode ? '#333' : '#ccc',
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
    },

    // Right-aligned message bubble (sent)
    messageBubbleRight: {
      alignSelf: 'flex-end',
      backgroundColor: darkMode ? '#1E88E5' : '#2894B0',
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      maxWidth: '80%',
    },

    // Text inside left bubble
    messageTextLeft: {
      color: darkMode ? '#eee' : '#000',
    },

    // Text inside right bubble
    messageTextRight: {
      color: '#fff',
    },

    // Container for the text input and send button
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: darkMode ? '#555' : '#ddd',
      backgroundColor: darkMode ? '#1A1A1A' : '#fff',
    },

    // Input field for typing messages
    textInput: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: darkMode ? '#666' : '#ccc',
      borderRadius: 20,
      marginRight: 10,
      fontSize: 16,
      color: darkMode ? '#fff' : '#000',
      backgroundColor: darkMode ? '#2C2C2C' : '#fff',
    },

    // Wrapper for the send button
    sendButton: {
      justifyContent: 'center',
    },

    // Send button label
    sendButtonText: {
      fontWeight: 'bold',
      color: darkMode ? '#90CAF9' : '#2894B0',
      fontSize: 16,
    },
  });
