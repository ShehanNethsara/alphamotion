import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 60) / COLUMN_COUNT; 


const CATEGORIES = [
  { id: '1', name: 'Strength', source: require('../../assets/images/3.jpg') },
  { id: '2', name: 'Cardio', source: require('../../assets/images/4.jpg') },
  { id: '3', name: 'Yoga', source: require('../../assets/images/5.jpg') },
  { id: '4', name: 'Running', source: require('../../assets/images/6.jpg') },
  { id: '5', name: 'HIIT', source: require('../../assets/images/7.jpg') },
  { id: '6', name: 'Cycling', source: require('../../assets/images/8.jpg') },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      if (selected.length < 5) setSelected([...selected, id]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Select Fitness Categories</Text>
        <Text style={styles.subtitle}>Select up to 5 to begin your journey</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        numColumns={COLUMN_COUNT}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity 
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.8}
            >

              <View style={styles.imageContainer}>
                <Image 
                  source={item.source} 
                  style={styles.categoryImage} 
                  resizeMode="cover" 
                />
                
                {isSelected && <View style={styles.activeOverlay} />}
              </View>

              <Text style={[styles.cardText, isSelected && styles.cardTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )
        }}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/(dashboard)/home')} 
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 20, 
    paddingTop: 60 
  },
  header: {
    marginBottom: 20,
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#CCFF00', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#888', 
    marginBottom: 10 
  },
  
  // --- CARD STYLES ---
  card: { 
    width: CARD_WIDTH,
    backgroundColor: '#1C1C1E', 
    margin: 8, 
    borderRadius: 20, 
    padding: 10, 
    alignItems: 'center', 
    height: 160, 
    borderWidth: 2, 
    borderColor: 'transparent', 
    
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  cardActive: { 
    borderColor: '#CCFF00', 
    backgroundColor: '#2C2C2E',
  },

  // Image 
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 15,
    overflow: 'hidden', 
    marginBottom: 10,
    backgroundColor: '#333',
  },

  categoryImage: {
    width: '100%',
    height: '100%',
  },

  
  activeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(204, 255, 0, 0.2)', 
  },

  cardText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16,
    marginTop: 5,
  },
  
  cardTextActive: {
    color: '#CCFF00', 
    fontWeight: 'bold',
  },

  // --- BUTTON STYLES ---
  button: { 
    backgroundColor: '#CCFF00', 
    padding: 18, 
    borderRadius: 30, 
    alignItems: 'center', 
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 5,
  },
  buttonText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});