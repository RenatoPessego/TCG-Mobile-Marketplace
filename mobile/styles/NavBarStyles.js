import { StyleSheet } from 'react-native';

export const getNavBarStyles = (isPortrait, darkMode = false) => {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2894B0',
    },
    navBar: {
      height: 60,
      backgroundColor: darkMode ? '#1E1E1E' : '#2894B0',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isPortrait ? 12 : 24,
      paddingTop: 10,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    marketText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    themeButton: {
      marginLeft: 12,
    },
    logoContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    logo: {
      height: isPortrait ? 35 : 45,
      resizeMode: 'contain',
      width: isPortrait ? 100 : 120,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    locationIcon: {
      fontSize: 20,
    },
    profile: {
      width: isPortrait ? 32 : 40,
      height: isPortrait ? 32 : 40,
      borderRadius: 20,
    },
    cart: {
      width: 24,
      height: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000066',
    },
    dropdown: {
      backgroundColor: darkMode ? '#2C2C2C' : '#fff',
      borderRadius: 8,
      paddingVertical: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    menuItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    dropdownItem: {
      fontSize: 16,
      fontWeight: '600',
      color: darkMode ? '#eee' : '#333',
    },
  });
};