// styles/registerStyles.js
import { StyleSheet } from 'react-native';

export const getRegisterStyles = (isPortrait) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#86E2F9',
      justifyContent: 'center',
      paddingHorizontal: isPortrait ? 32 : 64,
    },
    title: {
      fontSize: isPortrait ? 32 : 36,
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
    imagePicker: {
      backgroundColor: '#003A49',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginBottom: 16,
    },
    imagePickerText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    preview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: 16,
    },
    backLink: {
      marginTop: 20,
    },
    backText: {
      textAlign: 'center',
      color: '#003A49',
      fontWeight: 'bold',
    },
  });
