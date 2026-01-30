import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // 1. useLocalSearchParams එකතු කළා
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#CCFF00',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  gray: '#888888',
};

// 2. හැම Workout ID එකකටම අදාළ විස්තර මෙතන හදාගමු
const WORKOUT_DATA: any = {
  '1': {
    image: require('../../assets/images/1.jpg'),
    description: "Build upper body strength with this intensive power routine targeting chest, arms, and shoulders.",
    kcal: "320",
    time: "45 Mins",
    level: "Advanced",
    steps: [
      { id: '1', title: 'Warm Up', time: '05:00' },
      { id: '2', title: 'Push Ups', time: '02:00' },
      { id: '3', title: 'Dumbbell Press', time: '03:00' },
      { id: '4', title: 'Pull Ups', time: '02:00' },
    ]
  },
  '2': {
    image: require('../../assets/images/3.jpg'),
    description: "Sculpt your legs and glutes with this intermediate shredding workout.",
    kcal: "250",
    time: "30 Mins",
    level: "Inter.",
    steps: [
      { id: '1', title: 'Jump Squats', time: '03:00' },
      { id: '2', title: 'Lunges', time: '03:00' },
      { id: '3', title: 'Calf Raises', time: '02:00' },
    ]
  },
  '3': {
    image: require('../../assets/images/4.jpg'),
    description: "Start your day with a relaxing yoga flow to improve flexibility and mindfulness.",
    kcal: "100",
    time: "20 Mins",
    level: "Beginner",
    steps: [
      { id: '1', title: 'Sun Salutation', time: '05:00' },
      { id: '2', title: 'Warrior Pose', time: '03:00' },
      { id: '3', title: 'Tree Pose', time: '03:00' },
    ]
  },
  // Default Data (ID එකක් අවුල් ගියොත් පෙන්නන්න)
  'default': {
    image: require('../../assets/images/4.jpg'),
    description: "A great workout to keep you fit and healthy.",
    kcal: "200",
    time: "20 Mins",
    level: "General",
    steps: [
      { id: '1', title: 'Warm Up', time: '05:00' },
      { id: '2', title: 'Basic Exercise', time: '10:00' },
      { id: '3', title: 'Cool Down', time: '05:00' },
    ]
  }
};

export default function WorkoutActiveScreen() {
  const router = useRouter();
  
  // 3. යැවූ ID එක සහ Title එක ලබා ගැනීම
  const params = useLocalSearchParams();
  const { id, title } = params;

  // ID එකට අදාළ Data එක තෝරා ගැනීම (නැත්නම් default එක)
  const currentWorkout = WORKOUT_DATA[id as string] || WORKOUT_DATA['default'];
  const displayTitle = title || "Workout Details"; // Title එක නාවොත් default එකක්

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Dynamic Image */}
      <ImageBackground 
        source={currentWorkout.image} 
        style={styles.backgroundImage}
      >
        <View style={styles.imageOverlay} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.playButtonContainer}>
            <Ionicons name="play" size={40} color={COLORS.primary} style={{ marginLeft: 5 }} />
        </View>
      </ImageBackground>

      {/* 2. Content */}
      <View style={styles.detailsContainer}>
        <View style={styles.barIndicator} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Dynamic Title */}
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.subtitle}>Full Body • {currentWorkout.level}</Text>

          {/* Dynamic Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{currentWorkout.time}</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{currentWorkout.kcal} Kcal</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{currentWorkout.level}</Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{currentWorkout.description}</Text>

          {/* Dynamic Steps List */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionHeader}>Rounds</Text>
            <Text style={styles.itemCount}>{currentWorkout.steps.length} Sets</Text>
          </View>

          {currentWorkout.steps.map((step: any, index: number) => (
            <View key={step.id} style={styles.exerciseRow}>
              <View style={styles.exerciseLeft}>
                <Text style={styles.exerciseIndex}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
                <View>
                    <Text style={styles.exerciseTitle}>{step.title}</Text>
                    <Text style={styles.exerciseSub}>Repetitions</Text>
                </View>
              </View>
              <Text style={styles.exerciseTime}>{step.time}</Text>
            </View>
          ))}

        </ScrollView>

        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.45,
    justifyContent: 'space-between',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playButtonContainer: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  barIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 20,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: 25,
  },
  listHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15
  },
  itemCount: {
      color: COLORS.primary,
      fontSize: 14,
      fontWeight: '600'
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  exerciseLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15
  },
  exerciseIndex: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
      opacity: 0.5
  },
  exerciseTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  exerciseSub: {
      fontSize: 12,
      color: COLORS.gray,
      marginTop: 2
  },
  exerciseTime: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  bottomButtonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
  },
  startButton: {
      backgroundColor: COLORS.primary,
      padding: 18,
      borderRadius: 30,
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
  },
  startButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold'
  }
});