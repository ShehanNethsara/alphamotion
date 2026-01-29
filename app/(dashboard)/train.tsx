import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#CCFF00', // Neon Green
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  gray: '#888888',
};

// Mock Data: Categories
const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Pilates'];

// Mock Data: Workout Plans
const WORKOUT_PLANS = [
  {
    id: '1',
    title: 'Upper Body Power',
    level: 'Advanced',
    duration: '45 Min',
    image: require('../../assets/images/1.jpg'), // Assets වල තියෙන පින්තූරයක්
  },
  {
    id: '2',
    title: 'Leg Day Shred',
    level: 'Intermediate',
    duration: '30 Min',
    image: require('../../assets/images/3.jpg'),
  },
  {
    id: '3',
    title: 'Morning Yoga Flow',
    level: 'Beginner',
    duration: '20 Min',
    image: require('../../assets/images/4.jpg'),
  },
];

export default function TrainScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Header & Search */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Find a Workout</Text>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.gray} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search workout..."
            placeholderTextColor={COLORS.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity>
             <Ionicons name="filter" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. Categories (Horizontal Scroll) */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.categoryChip, 
                  selectedCategory === cat && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryText, 
                  selectedCategory === cat && styles.categoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Featured Plan (Daily Challenge) */}
        <Text style={styles.sectionTitle}>Daily Challenge</Text>
        <TouchableOpacity 
          activeOpacity={0.9} 
          // onPress={() => router.push('/(dashboard)/train-details')}
        >
          <ImageBackground
            source={require('../../assets/images/4.jpg')} // Featured Image
            style={styles.featuredCard}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.featuredOverlay}>
              <View style={styles.challengeBadge}>
                <Ionicons name="flame" size={14} color="#000" />
                <Text style={styles.challengeText}>Burn 500 Kcal</Text>
              </View>
              <View>
                <Text style={styles.featuredTitle}>High Intensity HIIT</Text>
                <Text style={styles.featuredSubtitle}>45 Minutes • Advanced</Text>
              </View>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* 4. Workout List */}
        <Text style={styles.sectionTitle}>Explore Plans</Text>
        
        {WORKOUT_PLANS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.planCard}
            // onPress={() => router.push('/(dashboard)/train-details', { id: item.id })}
          >
            <ImageBackground 
              source={item.image} 
              style={styles.planImage} 
              imageStyle={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}
            />
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>{item.title}</Text>
              <View style={styles.planMetaContainer}>
                <View style={styles.planMeta}>
                  <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
                <View style={styles.planMeta}>
                  <Ionicons name="barbell-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.metaText}>{item.level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.arrowButton}>
               <Ionicons name="chevron-forward" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 100, // Bottom Tab එකට ඉඩ
  },
  
  // Categories
  categoriesContainer: {
    marginBottom: 25,
    paddingLeft: 20,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.gray,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },

  // Titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 15,
  },

  // Featured Card
  featuredCard: {
    marginHorizontal: 20,
    height: 200,
    marginBottom: 30,
    justifyContent: 'flex-end',
  },
  featuredOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  challengeBadge: {
    position: 'absolute',
    top: -140,
    left: 15,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  challengeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredSubtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },

  // Plan Cards
  planCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    alignItems: 'center',
    paddingRight: 15,
  },
  planImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  planDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  planTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planMetaContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  arrowButton: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});