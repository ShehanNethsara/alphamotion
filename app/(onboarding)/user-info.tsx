import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'; // Auth ගන්න
import { saveUserStats } from '../../services/userService'; // අපි අලුතින් හදපු function එක

export default function UserInfoScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [gender, setGender] = useState('Male');
  const [level, setLevel] = useState('Intermediate');
  const [age, setAge] = useState('21');
  const [weight, setWeight] = useState('60');
  const [height, setHeight] = useState('170');
  const [loading, setLoading] = useState(false); // Loading State

  const handleContinue = async () => {
    if (!user) return;

    // 1. Loading පටන් ගන්නවා
    setLoading(true);

    try {
      // 2. Data ටික Firebase එකට Save කරනවා
      await saveUserStats(user.uid, {
        gender,
        age,
        weight,
        height,
        level
      });

      // 3. ඊළඟ පිටුවට යනවා
      router.push('/(onboarding)/categories');

    } catch (error) {
      Alert.alert("Error", "Failed to save data. Please try again.");
    } finally {
      // 4. Loading නවත්තනවා
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressItem, { backgroundColor: '#CCFF00' }]} />
        <View style={[styles.progressItem, { backgroundColor: '#CCFF00' }]} />
        <View style={[styles.progressItem, { backgroundColor: '#333' }]} />
        <View style={[styles.progressItem, { backgroundColor: '#333' }]} />
      </View>

      <Text style={styles.headerTitle}>Tell us about you</Text>

      {/* Gender */}
      <Text style={styles.label}>What is your gender?</Text>
      <View style={styles.row}>
        {['Male', 'Female'].map((g) => (
          <TouchableOpacity 
            key={g} 
            style={[styles.radioBtn, gender === g && styles.radioBtnActive]}
            onPress={() => setGender(g)}
          >
            <Ionicons name={g === 'Male' ? 'male' : 'female'} size={20} color={gender === g ? '#000' : '#fff'} />
            <Text style={[styles.radioText, gender === g && { color: '#000' }]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Age */}
      <Text style={styles.label}>Your Age</Text>
      <TextInput 
        style={styles.input} 
        value={age} 
        onChangeText={setAge} 
        keyboardType="numeric" 
        textAlign="center"
      />

      {/* Weight */}
      <Text style={styles.label}>Current Weight (kg)</Text>
      <TextInput 
        style={styles.input} 
        value={weight} 
        onChangeText={setWeight} 
        keyboardType="numeric" 
        textAlign="center"
      />

      {/* Height */}
      <Text style={styles.label}>Height (cm)</Text>
      <TextInput 
        style={styles.input} 
        value={height} 
        onChangeText={setHeight} 
        keyboardType="numeric" 
        textAlign="center"
      />

      {/* Fitness Level */}
      <Text style={styles.label}>Fitness Level</Text>
      <View style={styles.levelContainer}>
        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
          <TouchableOpacity 
            key={l} 
            style={[styles.levelBtn, level === l && { borderColor: '#CCFF00' }]}
            onPress={() => setLevel(l)}
          >
            <Text style={[styles.levelText, level === l && { color: '#CCFF00' }]}>{l}</Text>
            {level === l && <Ionicons name="checkmark-circle" size={20} color="#CCFF00" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button with Loading */}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}
        disabled={loading} // Loading වෙද්දී ඔබන්න බෑ
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 20, paddingBottom: 50 },
  progressBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 20 },
  progressItem: { height: 5, width: '22%', borderRadius: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  label: { color: '#fff', fontSize: 16, marginTop: 20, marginBottom: 10 },
  
  row: { flexDirection: 'row', gap: 10 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 30, borderWidth: 1, borderColor: '#333', flex: 1, justifyContent: 'center' },
  radioBtnActive: { backgroundColor: '#CCFF00', borderColor: '#CCFF00' },
  radioText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  
  input: { backgroundColor: '#1C1C1E', color: '#fff', fontSize: 24, padding: 15, borderRadius: 15, textAlign: 'center', fontWeight: 'bold' },
  
  levelContainer: { gap: 10 },
  levelBtn: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#1C1C1E', borderRadius: 15, borderWidth: 1, borderColor: '#1C1C1E' },
  levelText: { color: '#fff', fontSize: 16 },
  
  button: { backgroundColor: '#CCFF00', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40, marginBottom: 20 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});