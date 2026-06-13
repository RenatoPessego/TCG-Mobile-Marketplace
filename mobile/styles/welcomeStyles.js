// styles/welcomeStyles.js
import { StyleSheet } from 'react-native';

export const getWelcomeStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#86E2F9',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isPortrait ? 16 : 32,
    },
    title: {
      fontSize: isPortrait ? 40 : 48,
      fontWeight: 'bold',
      color: '#003A49',
      textAlign: 'center',
      marginBottom: isPortrait ? 40 : 60,
    },
    buttonContainer: {
      flexDirection: isPortrait ? 'column' : 'row',
      alignItems: 'center',
      gap: isPortrait ? 16 : 24,
    },
    button: {
      backgroundColor: '#2894B0',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: '#003A49',
      marginVertical: isPortrait ? 10 : 0,
      marginHorizontal: isPortrait ? 0 : 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });
