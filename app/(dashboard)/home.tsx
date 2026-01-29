import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ImageBackground 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const POPULAR_WORKOUTS = [
  { 
    id: '1', 
    title: 'Squat Exercise', 
    duration: '12 Minutes', 
    kcal: '120 Kcal', 
    image: require('../../assets/images/1.jpg') // Squat image එක දාන්න
  },
  { 
    id: '2', 
    title: 'Full Body Stretching', 
    duration: '12 Minutes', 
    kcal: '120 Kcal', 
    image: require('../../assets/images/3.jpg') // Stretch image එක දාන්න
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Popular</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.searchButton]}>
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. FEATURED CARD (Dumbbell Step Up) */}
        <TouchableOpacity 
            activeOpacity={0.9} 
            // onPress={() => router.push('/(dashboard)/workout-active')}//////////////////////////////////////////////
        >
          <ImageBackground 
            source={require('../../assets/images/4.jpg')} // Main Hero Image එක දාන්න
            style={styles.featuredCard}
            imageStyle={{ borderRadius: 25 }}
          >
            {/* Top Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Dumbbell Step Up</Text>
            </View>

            {/* Bottom Info Overlay */}
            <View style={styles.cardOverlay}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.metaText}>12 Minutes</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="flame-outline" size={16} color="#fff" />
                  <Text style={styles.metaText}>120 Kcal</Text>
                </View>
              </View>
              <Ionicons name="star" size={20} color="#FFD700" />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* 3. MOST POPULAR SECTION */}
        <Text style={styles.sectionTitle}>Most Popular</Text>

        <View style={styles.gridContainer}>
          {POPULAR_WORKOUTS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.workoutCard}>
              <ImageBackground 
                source={item.image} 
                style={styles.workoutImage}
                imageStyle={{ borderRadius: 20 }}
              >
                {/* Play Button Overlay */}
                <View style={styles.playIconContainer}>
                  <Ionicons name="play-circle" size={40} color="#CCFF00" />
                </View>
                {/* Star Icon */}
                <View style={styles.cardStar}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                </View>
              </ImageBackground>
              
              <Text style={styles.workoutTitle}>{item.title}</Text>
              
              <View style={styles.workoutMeta}>
                <Text style={styles.smallMetaText}>
                  <Ionicons name="time-outline" size={12} color="#888" /> {item.duration}
                </Text>
                <Text style={styles.smallMetaText}>
                  <Ionicons name="flame-outline" size={12} color="#888" /> {item.kcal}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#CCFF00', // කහ පාට Search Button එක
  },

  // Featured Card
  featuredCard: {
    width: '100%',
    height: 350, // පින්තූරේ ලොකු උස
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 30,
  },
  badge: {
    backgroundColor: '#CCFF00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.6)', // යටින් එන කළු පාට ශේඩ් එක
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#fff',
    fontSize: 12,
  },

  // Most Popular
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutCard: {
    width: (width - 50) / 2, // Screen එක දෙකට බෙදලා
    marginBottom: 20,
  },
  workoutImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  playIconContainer: {
    backgroundColor: '#000',
    borderRadius: 20,
  },
  cardStar: {
      position: 'absolute',
      top: 10,
      right: 10,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallMetaText: {
    color: '#888',
    fontSize: 10,
  },
});