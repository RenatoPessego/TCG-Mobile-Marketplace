import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getRegisterStyles } from '../styles/registerStyles';
import { API_URL } from '../config';
import { useTheme } from '../components/ThemeContext';
import * as ImageManipulator from 'expo-image-manipulator';


export default function RegisterPage() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const registerStyles = getRegisterStyles(isPortrait);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: new Date(),
    profileImage: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  async function compressImage(uri) {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return result.base64;
  }

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled) {
      const base64 = await compressImage(result.assets[0].uri);
      setForm({ ...form, profileImage: `data:image/jpeg;base64,${base64}` });
    }
  };

  const isPasswordSecure = (password) =>
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password) &&
    password.length >= 12;

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = async () => {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      birthDate,
      profileImage,
    } = form;

    if (!name || !username || !email || !password || !confirmPassword) {
      return Alert.alert('Please fill all required fields');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Passwords do not match');
    }

    if (!isPasswordSecure(password)) {
      return Alert.alert('Password must have 12+ characters, uppercase, lowercase, number and special char');
    }

    if (calculateAge(birthDate) < 13) {
      return Alert.alert('You must be at least 13 years old to register');
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          confirmPassword,
          birthDate,
          profileImage,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        await AsyncStorage.setItem('authToken', data.token);
        Alert.alert('Account created');
        navigation.replace('Home');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (err) {
      Alert.alert('Network error', 'Could not reach the server');
    }
  };

  return (
    <View style={[registerStyles.container, { backgroundColor:'#fff' }]}>
      <Text style={registerStyles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor={'#666'}
        style={registerStyles.input}
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        placeholder="Username"
        placeholderTextColor={'#666'}
        style={registerStyles.input}
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={'#666'}
        style={registerStyles.input}
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={'#666'}
        style={registerStyles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor={'#666'}
        style={registerStyles.input}
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />

      <TouchableOpacity  onPress={() => setShowDatePicker(true)} style={registerStyles.input}>
        <Text testID='TextBirth' style={{ color: '#000' }}>
          Birth Date: {form.birthDate.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID='birthDatePicker'
          value={form.birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setForm({ ...form, birthDate: date });
          }}
          
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity onPress={handlePickImage} style={registerStyles.imagePicker}>
        <Text style={registerStyles.imagePickerText}>
          {form.profileImage ? 'Change Profile Image' : 'Upload Profile Image'}
        </Text>
      </TouchableOpacity>

      {form.profileImage && (
        <Image source={{ uri: form.profileImage }} style={registerStyles.preview} />
      )}

      <TouchableOpacity onPress={handleRegister} style={registerStyles.button}>
        <Text style={registerStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Welcome')} style={registerStyles.backLink}>
        <Text style={registerStyles.backText}>Back to Welcome Page</Text>
      </TouchableOpacity>
    </View>
  );
}
