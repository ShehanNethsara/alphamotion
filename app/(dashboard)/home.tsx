import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Mock Data (Workout List)
// ඔයාගේ assets folder එකේ මේ පින්තූර තියෙනවද බලන්න (1.jpg, 3.jpg)
const POPULAR_WORKOUTS = [
  { 
    id: '1', 
    title: 'Full Body HIIT', 
    duration: '30 min', 
    kcal: '320 Kcal', 
    image: require('../../assets/images/1.jpg') 
  },
  { 
    id: '2', 
    title: 'Cardio Blast', 
    duration: '20 min', 
    kcal: '210 Kcal', 
    image: require('../../assets/images/3.jpg') 
  },
  { 
    id: '3', 
    title: 'Core Power', 
    duration: '15 min', 
    kcal: '150 Kcal', 
    image: require('../../assets/images/4.jpg') 
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER SECTION (Greeting & Profile) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>Tanya Hill</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/profile')}>
            <Image 
              source={require('../../assets/images/1.jpg')} // Profile Picture
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        {/* 2. STATS BAR (Calories, Time, Heart Rate) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={styles.iconCircle}>
                <Ionicons name="flame" size={20} color="#CCFF00" />
            </View>
            <Text style={styles.statValue}>820</Text>
            <Text style={styles.statLabel}>Kcal</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <View style={styles.iconCircle}>
                <Ionicons name="time" size={20} color="#CCFF00" />
            </View>
            <Text style={styles.statValue}>50</Text>
            <Text style={styles.statLabel}>Mins</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <View style={styles.iconCircle}>
                <Ionicons name="heart" size={20} color="#CCFF00" />
            </View>
            <Text style={styles.statValue}>110</Text>
            <Text style={styles.statLabel}>Bpm</Text>
          </View>
        </View>

        {/* 3. HERO SECTION ("Ready to Workout?") */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Ready to {'\n'}Workout?</Text>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={() => router.push('/(dashboard)/train')}
            >
              <Text style={styles.startButtonText}>Start Now</Text>
              <Ionicons name="play" size={16} color="black" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
          {/* දුවන කෙනෙක්ගේ පින්තූරයක් මෙතනට දාන්න (4.jpg හෝ hero.png) */}
          <Image 
            source={require('../../assets/images/4.jpg')} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* 4. POPULAR WORKOUTS LIST */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Workouts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {POPULAR_WORKOUTS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.workoutCard}>
              <Image source={item.image} style={styles.workoutImage} />
              
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>{item.title}</Text>
                <View style={styles.workoutMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#CCFF00" />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                  <Text style={styles.metaSeparator}>|</Text>
                  <View style={styles.metaItem}>
                    <Ionicons name="flame-outline" size={14} color="#CCFF00" />
                    <Text style={styles.metaText}>{item.kcal}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
  
  // 1. Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#CCFF00',
  },

  // 2. Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E', // Dark Gray Box
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 25,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(204, 255, 0, 0.1)', // Neon low opacity background
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#333',
    alignSelf: 'center',
  },

  // 3. Hero Section Styles
  heroCard: {
    backgroundColor: '#CCFF00', // Neon Background
    borderRadius: 25,
    padding: 20,
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden', // පින්තූරේ එළියට යන එක නවත්තන්න
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 10,
  },
  heroTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 15,
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  heroImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-10deg' }] // පොඩි design effect එකක්
  },

  // 4. Popular Workouts Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#CCFF00',
    fontSize: 14,
  },
  horizontalList: {
    marginHorizontal: -20, // Screen එකේ කෙලවරටම යවන්න
    paddingHorizontal: 20,
  },
  workoutCard: {
    width: width * 0.5, // Screen එකෙන් 50% මහත
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    marginRight: 15,
    padding: 10,
  },
  workoutImage: {
    width: '100%',
    height: 100,
    borderRadius: 15,
    marginBottom: 10,
  },
  workoutInfo: {
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3
  },
  metaText: {
    color: '#888',
    fontSize: 12,
  },
  metaSeparator: {
    color: '#333',
    marginHorizontal: 8,
  },
});