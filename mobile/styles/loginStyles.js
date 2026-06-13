// styles/loginStyles.js
import { StyleSheet } from 'react-native';

export const getLoginStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#86E2F9',
      justifyContent: 'center',
      paddingHorizontal: isPortrait ? 32 : 64,
    },
    title: {
      fontSize: isPortrait ? 32 : 40,
      fontWeight: 'bold',
      color: '#003A49',
      marginBottom: 32,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#2894B0',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    backText: {
      textAlign: 'center',
      color: '#003A49',
      fontWeight: 'bold',
      marginTop: 20,
    },
    
  });
