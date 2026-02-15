import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Alert,
  ImageSourcePropType,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth'; 

import COLORS from '../../constants/Colors';
import { logCompletedWorkout } from '../../services/workoutService';

const { height } = Dimensions.get('window');

interface Step {
  id: string;
  title: string;
  time: number;
}

interface Workout {
  image: ImageSourcePropType;
  description: string;
  kcal: string;
  time: string;
  level: string;
  steps: Step[];
}

const WORKOUT_DATA: Record<string, Workout> = {
  '1': {
    image: require('../../assets/images/9.jpg'), 
    description: "Build upper body strength with this intensive power routine.",
    kcal: "320",
    time: "45 Mins",
    level: "Advanced",
    steps: [
      { id: '1', title: 'Warm Up', time: 5 },
      { id: '2', title: 'Push Ups', time: 10 },
      { id: '3', title: 'Dumbbell Press', time: 10 },
      { id: '4', title: 'Rest', time: 5 },
    ]
  },
  '2': {
    image: require('../../assets/images/10.jpg'),
    description: "Sculpt your legs and glutes.",
    kcal: "250",
    time: "30 Mins",
    level: "Inter.",
    steps: [
      { id: '1', title: 'Jump Squats', time: 10 },
      { id: '2', title: 'Lunges', time: 10 },
      { id: '3', title: 'Rest', time: 5 },
    ]
  },
  '3': {
    image: require('../../assets/images/11.jpg'),
    description: "Relaxing yoga flow.",
    kcal: "100",
    time: "20 Mins",
    level: "Beginner",
    steps: [
      { id: '1', title: 'Sun Salutation', time: 15 },
      { id: '2', title: 'Warrior Pose', time: 15 },
    ]
  },
  '4': {
    image: require('../../assets/images/12.jpg'),
    description: "High intensity interval training.",
    kcal: "500",
    time: "25 Mins",
    level: "Advanced",
    steps: [
      { id: '1', title: 'Jumping Jacks', time: 10 },
      { id: '2', title: 'Burpees', time: 10 },
      { id: '3', title: 'Plank', time: 10 },
    ]
  },
  'default': {
    image: require('../../assets/images/1.jpg'), 
    description: "General workout.",
    kcal: "200",
    time: "20 Mins",
    level: "General",
    steps: [
      { id: '1', title: 'Get Ready', time: 5 },
      { id: '2', title: 'Go!', time: 10 },
    ]
  }
};

export default function WorkoutActiveScreen() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams();
  const auth = getAuth(); 

  const currentWorkout = WORKOUT_DATA[id as string] || WORKOUT_DATA['default'];
  const displayTitle = title || "Workout Details";

  const [isPlayerActive, setIsPlayerActive] = useState(false); 
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const startWorkout = () => {
    setIsPlayerActive(true);
    setCurrentStepIndex(0);
    if (currentWorkout.steps && currentWorkout.steps.length > 0) {
        setTimeLeft(currentWorkout.steps[0].time);
    }
    setIsPaused(false);
  };

  const closePlayer = () => {
    setIsPaused(true); 
    Alert.alert("Quit Workout?", "Are you sure you want to quit?", [
      { text: "Cancel", style: "cancel", onPress: () => setIsPaused(false) },
      { text: "Quit", style: "destructive", onPress: () => setIsPlayerActive(false) } 
    ]);
  };

  const handleNextStep = async () => {
    if (!currentWorkout.steps || currentWorkout.steps.length === 0) return;

    if (currentStepIndex < currentWorkout.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(currentWorkout.steps[nextIndex].time);
    } else {
      setIsPaused(true);

      if (auth.currentUser) {
        await logCompletedWorkout(
          auth.currentUser.uid,
          displayTitle as string,   
          currentWorkout.time.replace(' Mins', ''), 
          currentWorkout.kcal     
        );
      }

      Alert.alert("Workout Completed! 🎉", "Great job! Progress saved.", [
        { text: "Finish", onPress: () => {
           setIsPlayerActive(false);
           router.back(); 
        }}
      ]);
    }
  };

  useEffect(() => {
    if (!isPlayerActive || isPaused) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextStep();
    }
  }, [timeLeft, isPaused, isPlayerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isPlayerActive) {
    const currentStep = currentWorkout.steps ? currentWorkout.steps[currentStepIndex] : null;
    const nextStep = currentWorkout.steps ? currentWorkout.steps[currentStepIndex + 1] : null;

    if (!currentStep) {
      return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} style={{marginTop: 50}} />
            <TouchableOpacity onPress={() => setIsPlayerActive(false)} style={{marginTop:20, alignSelf:'center'}}>
                <Text style={{color:'white'}}>Go Back</Text>
            </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <ImageBackground 
          source={currentWorkout.image} 
          style={styles.playerBg} 
          blurRadius={15}
        >
          <View style={styles.overlay} />

          <View style={styles.playerHeader}>
            <TouchableOpacity onPress={closePlayer} style={styles.closeBtn}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.stepCounter}>Step {currentStepIndex + 1} / {currentWorkout.steps.length}</Text>
          </View>

          <View style={styles.timerContainer}>
            <View style={styles.circle}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.label}>{currentStep.title}</Text>
            </View>
          </View>

          {nextStep ? (
            <View style={styles.nextContainer}>
              <Text style={styles.nextLabel}>Up Next:</Text>
              <Text style={styles.nextTitle}>{nextStep.title}</Text>
            </View>
          ) : (
            <View style={styles.nextContainer}>
                <Text style={styles.nextLabel}>Up Next:</Text>
                <Text style={styles.nextTitle}>Finish</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlBtn} 
              onPress={() => {
                if(currentStepIndex > 0) {
                  const prevIndex = currentStepIndex - 1;
                  setCurrentStepIndex(prevIndex);
                  setTimeLeft(currentWorkout.steps[prevIndex].time);
                }
              }}
            >
              <Ionicons name="play-skip-back" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlBtn, styles.playBtn]} 
              onPress={() => setIsPaused(!isPaused)}
            >
              <Ionicons name={isPaused ? "play" : "pause"} size={40} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={handleNextStep}>
              <Ionicons name="play-skip-forward" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // --- Render Details View ---
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground source={currentWorkout.image} style={styles.backgroundImage}>
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

      <View style={styles.detailsContainer}>
        <View style={styles.barIndicator} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.subtitle}>Full Body • {currentWorkout.level}</Text>

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

          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionHeader}>Rounds</Text>
            <Text style={styles.itemCount}>{currentWorkout.steps ? currentWorkout.steps.length : 0} Sets</Text>
          </View>

          {currentWorkout.steps && currentWorkout.steps.map((step: Step, index: number) => (
            <View key={step.id} style={styles.exerciseRow}>
              <View style={styles.exerciseLeft}>
                <Text style={styles.exerciseIndex}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</Text>
                <View>
                    <Text style={styles.exerciseTitle}>{step.title}</Text>
                    <Text style={styles.exerciseSub}>Repetitions</Text>
                </View>
              </View>
              <Text style={styles.exerciseTime}>{step.time}s</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startWorkout} 
            >
                <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { width: '100%', height: height * 0.45, justifyContent: 'space-between' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20 },
  iconButton: { width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  playButtonContainer: { alignSelf: 'center', marginBottom: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  detailsContainer: { flex: 1, backgroundColor: COLORS.background, marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 10 },
  barIndicator: { width: 40, height: 5, backgroundColor: '#333', borderRadius: 3, alignSelf: 'center', marginTop: 10, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: COLORS.primary, marginBottom: 20, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 15, padding: 15, justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  verticalLine: { width: 1, height: 20, backgroundColor: '#333' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.gray, lineHeight: 22, marginBottom: 25 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemCount: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  exerciseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 15, borderRadius: 15, marginBottom: 10 },
  exerciseLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  exerciseIndex: { fontSize: 16, color: '#fff', fontWeight: 'bold', opacity: 0.5 },
  exerciseTitle: { fontSize: 16, color: '#fff', fontWeight: '600' },
  exerciseSub: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  exerciseTime: { fontSize: 14, color: COLORS.primary, fontWeight: 'bold' },
  bottomButtonContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  startButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 30, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  startButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  playerBg: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  playerHeader: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { padding: 10, backgroundColor: '#333', borderRadius: 20 },
  stepCounter: { color: '#ccc', fontSize: 16, fontWeight: 'bold' },
  timerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 50 },
  circle: { width: 250, height: 250, borderRadius: 125, borderWidth: 5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  timerText: { color: '#fff', fontSize: 60, fontWeight: 'bold' },
  label: { color: COLORS.primary, fontSize: 24, marginTop: 10, fontWeight: '600', textAlign: 'center' },
  nextContainer: { alignItems: 'center', marginBottom: 50 },
  nextLabel: { color: '#888', fontSize: 14, textTransform: 'uppercase' },
  nextTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30, marginBottom: 50 },
  controlBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary },
});