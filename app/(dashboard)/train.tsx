import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground, 
  TextInput,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../constants/Colors';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Pilates'];

// Workouts Data
const WORKOUT_PLANS = [
  {
    id: '1',
    title: 'Upper Body Power',
    level: 'Advanced',
    duration: '45 Min',
    kcal: '400',
    image: require('../../assets/images/9.jpg'),
    category: 'Strength'
  },
  {
    id: '2',
    title: 'Leg Day Shred',
    level: 'Intermediate',
    duration: '30 Min',
    kcal: '350',
    image: require('../../assets/images/10.jpg'),
    category: 'Strength'
  },
  {
    id: '3',
    title: 'Morning Yoga Flow',
    level: 'Beginner',
    duration: '20 Min',
    kcal: '150',
    image: require('../../assets/images/11.jpg'),
    category: 'Yoga'
  },
  {
    id: '4',
    title: 'HIIT Cardio Blast',
    level: 'Advanced',
    duration: '25 Min',
    kcal: '500',
    image: require('../../assets/images/12.jpg'),
    category: 'HIIT'
  },
  {
    id: '5',
    title: 'Core Crusher Abs',
    level: 'Intermediate',
    duration: '15 Min',
    kcal: '200',
    image: require('../../assets/images/13.jpg'),
    category: 'Strength'
  },
  {
    id: '6',
    title: 'Pilates for Back',
    level: 'Beginner',
    duration: '20 Min',
    kcal: '180',
    image: require('../../assets/images/114.jpg'),
    category: 'Pilates'
  },
  {
    id: '7',
    title: 'Full Body Burn',
    level: 'Advanced',
    duration: '40 Min',
    kcal: '450',
    image: require('../../assets/images/15.jpg'),
    category: 'Cardio'
  },
  {
    id: '8',
    title: 'Sleepy Time Yoga',
    level: 'Beginner',
    duration: '10 Min',
    kcal: '80',
    image: require('../../assets/images/16.jpg'),
    category: 'Yoga'
  },
];

export default function TrainScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  //  DAILY CHALLENGE LOGIC 
  const dailyChallenge = useMemo(() => {
    const today = new Date().getDate();
    const index = today % WORKOUT_PLANS.length;
    return WORKOUT_PLANS[index];
  }, []);

  //  Search & Filter Logic
  const filteredPlans = WORKOUT_PLANS.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

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
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
               <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
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

        {searchText === '' && selectedCategory === 'All' && (
          <View>
            <Text style={styles.sectionTitle}>Daily Challenge</Text>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => router.push({
                pathname: '/(dashboard)/workout-active',
                params: { id: dailyChallenge.id, title: dailyChallenge.title }
              })}
            >
              <ImageBackground
                source={dailyChallenge.image} 
                style={styles.featuredCard}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.featuredOverlay}>
                  <View style={styles.challengeBadge}>
                    <Ionicons name="flame" size={14} color="#000" />
                    <Text style={styles.challengeText}>Burn {dailyChallenge.kcal} Kcal</Text>
                  </View>
                  <View>

                    <Text style={styles.featuredTitle}>{dailyChallenge.title}</Text>
                    <Text style={styles.featuredSubtitle}>{dailyChallenge.duration} • {dailyChallenge.level}</Text>
                  </View>
                  
                  <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {searchText ? 'Search Results' : 'Explore Plans'}
        </Text>
        
        {filteredPlans.length > 0 ? (
          filteredPlans.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.planCard}
              onPress={() => router.push({
                pathname: '/(dashboard)/workout-active',
                params: { id: item.id, title: item.title }
              })}
            >
              <Image 
                source={item.image} 
                style={styles.planImage} 
                resizeMode="cover"
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
                  <View style={styles.planMeta}>
                    <Text style={[styles.metaText, {color: COLORS.primary}]}>{item.category}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.arrowButton}>
                 <Ionicons name="chevron-forward" size={20} color="#000" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={50} color={COLORS.gray} />
            <Text style={styles.emptyText}>No workouts found</Text>
          </View>
        )}

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
    paddingBottom: 100, 
  },
  
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 15,
  },

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

  planCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    alignItems: 'center',
    padding: 10,
  },
  planImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
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
    flexWrap: 'wrap',
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
  
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    opacity: 0.5,
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: 10,
    fontSize: 16,
  }
});