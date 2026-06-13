import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  UIManager
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { API_URL } from '../config';
import { getNavBarStyles } from '../styles/NavBarStyles';
import { useTheme } from '../components/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MenuModal = ({ 
  visible, 
  onClose, 
  items, 
  darkMode, 
  isPortrait, 
  anchorRef,
  alignLeft = false 
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { width } = useWindowDimensions();
  const styles = getNavBarStyles(isPortrait, darkMode);

  useEffect(() => {
    if (visible && anchorRef.current) {
      anchorRef.current.measureInWindow((x, y, w, h) => {
        const menuWidth = isPortrait ? 150 : 200;
        let left = x;
        
        if (alignLeft) {
          left = x + w - menuWidth;
        }

        left = Math.max(10, Math.min(left, width - menuWidth - 10));

        setPosition({
          top: y + h + (Platform.OS === 'ios' ? 10 : 5),
          left,
          width: menuWidth
        });
      });
    }
  }, [visible, width, isPortrait]);

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade" 
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View 
            style={[
              styles.dropdown, 
              {
                position: 'absolute',
                top: position.top,
                left: position.left,
                width: position.width
              }
            ]}
          >
            {items.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                style={styles.menuItem}
              >
                <Text style={styles.dropdownItem}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

export default function NavBar() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const { height, width } = useWindowDimensions();
  const isPortrait = height >= width;
  const styles = getNavBarStyles(isPortrait, darkMode);

  const marketButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleLogout = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    // Call the logout endpoint
    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }

    // Clean local storage
    await AsyncStorage.multiRemove([
      'authToken',
      'accessToken',
      'refreshToken',
      'rememberedUser'
    ]);
    
    setProfileMenuVisible(false);
    navigation.replace('Welcome');
  } catch (error) {
    console.error('Error during logout:', error);
    navigation.replace('Welcome');
  }
};

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.user?.profileImage) {
          setProfileImage(data.user.profileImage);
        }
      } catch (err) {
        console.warn('⚠️ Failed to load profile image:', err.message);
      }
    };

    loadProfileImage();
  }, []);

  const marketItems = [
    { label: 'Buy', onPress: () => navigation.navigate('Market') },
    { label: 'Sell', onPress: () => navigation.navigate('SellCard') }
  ];

  const profileItems = [
    { label: 'View Profile', onPress: () => navigation.navigate('Profile') },
    { label: 'Logout', onPress: handleLogout }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navBar}>
        {/* Left - Market + Theme */}
        <View style={styles.leftContainer}>
          <TouchableOpacity 
            ref={marketButtonRef}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Text style={styles.marketText}>Market</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Feather
              name={darkMode ? 'moon' : 'sun'}
              size={22}
              color={darkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>

        {/* Center - Logo */}
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>

        {/* Right - Location + Profile + Cart */}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('NearbyLocation')}>
            <Text style={styles.locationIcon}>📍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            ref={profileButtonRef}
            onPress={() => setProfileMenuVisible(!profileMenuVisible)}
          >
            <Image
              source={profileImage ? { uri: profileImage } : require('../assets/profile-placeholder.png')}
              style={styles.profile}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Market')}>
            <Image
              source={require('../assets/cart-icon.png')}
              style={[styles.cart, { tintColor: darkMode ? '#fff' : '#000' }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Market Menu */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={marketItems}
        darkMode={darkMode}
        isPortrait={isPortrait}
        anchorRef={marketButtonRef}
      />

      {/* Profile Menu (opens to the left) */}
      <MenuModal
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        items={profileItems}
        darkMode={darkMode}
        isPortrait={isPortrait}
        anchorRef={profileButtonRef}
        alignLeft={true}
      />
    </SafeAreaView>
  );
}