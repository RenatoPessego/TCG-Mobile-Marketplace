import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { getOpenPacksStyles } from '../styles/openPacksStyles';
import NavBar from '../components/NavBar';
import * as Animatable from 'react-native-animatable';
import { waitFor } from '@testing-library/react-native';

export default function OpenPacksPage() {
  const [rarity, setRarity] = useState('common');
  const [cardCount, setCardCount] = useState(1);
  const [setList, setSetList] = useState([]);
  const [packSource, setPackSource] = useState('');
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(null);

  const { darkMode } = useTheme();
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const styles = getOpenPacksStyles(isPortrait, darkMode, width, height);

  const rarityOptions = ['common', 'rare', 'super_rare', 'legendary'];
  const cardCountOptions = [1, 3, 5, 7, 9];

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await fetch('https://db.ygoprodeck.com/api/v7/cardsets.php');
        const data = await res.json();
        if (Array.isArray(data)) {
          setSetList(data.map(set => set.set_name));
          setPackSource(data[0].set_name);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load pack sets');
      }
    };
    fetchSets();
  }, []);

  useEffect(() => {
    setImageLoaded(false);
  }, [selectedIndex]);

  const generatePack = async () => {
    try {
      setLoading(true);
      setShowCards(false);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Token missing');
      const response = await fetch(`${API_URL}/packs/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rarityType: rarity, cardCount, packSource }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setPack(data.packs[0]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not generate pack');
    } finally {
      setLoading(false);
    }
  };

  const openPack = async () => {
    try {
      setOpening(true);
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_URL}/packs/open`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rarity: pack.rarity,
            cardCount: pack.cardCount,
            packSource: pack.packSource,
          }),
        });
        const data = await res.json();
        if (res.status === 402) {
          Alert.alert('Error', 'Insufficient balance.');
          throw new Error('Insufficient balance');
        }
        if (!res.ok) throw new Error(data.message);
        
        
        setCards(data.cards);
        setSelectedIndex(0);
        setShowCards(true);
      }, 1000);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not open pack');
    } finally {
      setTimeout(() => setOpening(false), 800);
    }
  };

  const renderCard = () => {
    const card = cards[selectedIndex];
    return (
      <View style={styles.cardReveal}>
        <TouchableOpacity onPress={() => setShowCards(false)} style={styles.closeButton}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.revealTitle}>✨ You got:</Text>
        {imageLoaded ? (
          <Animatable.View key={card.id} animation="zoomIn" duration={600}>
            <Image
              source={card.image_url ? { uri: card.image_url } : require('../assets/not-found-card.png')}
              style={styles.cardImage}
            />
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={styles.cardRarity}>Rarity: {card.rarity}</Text>
          </Animatable.View>
        ) : (
          <ActivityIndicator size="large" color="#2894B0" style={styles.loadingIndicator} />
        )}
        <Image
          source={card.image_url ? { uri: card.image_url } : require('../assets/not-found-card.png')}
          onLoadEnd={() => setImageLoaded(true)}
          style={styles.preloadImage}
        />
        <View style={styles.navigationButtons}>
          <TouchableOpacity disabled={selectedIndex === 0} onPress={() => setSelectedIndex(i => i - 1)}>
            <Text style={styles.arrow}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.indexText}>{selectedIndex + 1} / {cards.length}</Text>
          <TouchableOpacity disabled={selectedIndex === cards.length - 1} onPress={() => setSelectedIndex(i => i + 1)}>
            <Text style={styles.arrow}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCustomDropdown = (label, options, selectedValue, onChange, type) => {
  const modalHeight = Math.min(300, height * 0.5); // limit modal height for scroll

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(type)}
        style={styles.pickerContainer}
      >
        <Text style={{ color: darkMode ? '#fff' : '#000', padding: 15, fontSize: 16 }}>
          {String(selectedValue).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </Text>
      </TouchableOpacity>

      {/* Modal rendered only if matching type is selected */}
      {modalVisible === type && (
        <Modal
          transparent
          visible
          animationType="fade"
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={() => setModalVisible(null)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
            activeOpacity={1}
            onPress={() => setModalVisible(null)}
          >
            <View
              style={{
                backgroundColor: darkMode ? '#222' : '#fff',
                borderRadius: 12,
                maxHeight: modalHeight,
                paddingVertical: 10,
              }}
            >
              <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {options.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      onChange(item);
                      setModalVisible(null);
                    }}
                    style={{ paddingVertical: 12 }}
                  >
                    <Text style={{ fontSize: 16, color: darkMode ? '#fff' : '#000' }}>
                      {typeof item === 'string'
                        ? item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                        : item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}>
      <View style={styles.container}>
        <NavBar />
        <View style={{ flex: 1, flexDirection: isPortrait ? 'column' : 'row', padding: 16 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingRight: isPortrait ? 0 : 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>🧪 Select Pack Filters</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 4 }}>
                {renderCustomDropdown('Rarity', rarityOptions, rarity, setRarity, 'rarity')}
              </View>
              <View style={{ flex: 1, marginLeft: 4 }}>
                {renderCustomDropdown('Cards', cardCountOptions, cardCount, setCardCount, 'count')}
              </View>
            </View>
            {renderCustomDropdown('Pack', setList, packSource, setPackSource, 'pack')}
            <TouchableOpacity onPress={generatePack} style={[styles.generateButton, { alignSelf: 'stretch', marginTop: 16 }]}>
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color="#2894B0" style={styles.loadingIndicator} />
            ) : (
              pack && (
                <View style={[styles.largePack, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Animatable.Image
                    animation={opening ? 'flipOutY' : 'pulse'}
                    duration={opening ? 500 : 2000}
                    iterationCount={opening ? 1 : 'infinite'}
                    easing="ease-in-out"
                    source={require('../assets/Pack.png')}
                    style={[styles.packImage, { maxHeight: isPortrait ? 220 : 180 }]}
                  />
                  <Text style={styles.packTitle}>{pack.name}</Text>
                  <Text style={styles.packPrice}>{pack.price} 🪙</Text>
                  <Animatable.View animation={opening ? 'zoomOut' : undefined} duration={500}>
                    <TouchableOpacity onPress={openPack} style={[styles.openButton, { marginTop: 10 }]} disabled={opening}>
                      <Text style={styles.openButtonText}>{opening ? 'Opening...' : 'Open'}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )
            )}
          </View>
        </View>
        {showCards && cards.length > 0 && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000055',
            zIndex: 999
          }}>
            {renderCard()}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
