import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // import theme
import { getWelcomeStyles } from '../styles/welcomeStyles';

export default function WelcomePage({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  const { darkMode } = useTheme(); // get dark mode from context
  const welcomeStyles = getWelcomeStyles(isPortrait, darkMode); // pass to styles

  return (
    <View style={welcomeStyles.container}>
      <Text style={welcomeStyles.title}>Digimon</Text>

      <View style={welcomeStyles.buttonContainer}>
        <TouchableOpacity
          style={welcomeStyles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={welcomeStyles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={welcomeStyles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={welcomeStyles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
