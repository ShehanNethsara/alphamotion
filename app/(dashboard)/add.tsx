import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import COLORS from '../../constants/Colors';
import {
  addCustomWorkout,
  deleteCustomWorkout,
  getUserWorkouts,
  updateCustomWorkout,
  Workout
} from '../../services/workoutService';

// 👇 අලුත් Components
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import WorkoutCard from '../../components/WorkoutCard';

export default function AddWorkoutScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [kcal, setKcal] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserWorkouts(user.uid);
      setWorkouts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !duration || !kcal) {
      Alert.alert('Missing Fields', 'Please fill all details');
      return;
    }
    if (!user) {
      Alert.alert("Error", "Not logged in!");
      return;
    }

    const newWorkoutData = { userId: user.uid, title, duration, kcal };
    const tempId = Date.now().toString();

    try {
      if (editingId) {
        // Optimistic Update
        setWorkouts(prev => prev.map(item => item.id === editingId ? { ...item, ...newWorkoutData } : item));
        
        const currentEditId = editingId;
        resetForm();
        await updateCustomWorkout(currentEditId, newWorkoutData);
      } else {
        // Optimistic Create
        const optimisticItem = { id: tempId, ...newWorkoutData };
        setWorkouts(prev => [...prev, optimisticItem]);

        resetForm();
        const savedWorkout = await addCustomWorkout(newWorkoutData);
        setWorkouts(prev => prev.map(item => item.id === tempId ? { ...item, id: savedWorkout.id } : item));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save workout');
      fetchWorkouts();
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Workout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          const previousWorkouts = [...workouts];
          setWorkouts(prev => prev.filter(item => item.id !== id));
          if (editingId === id) resetForm();

          try {
            await deleteCustomWorkout(id);
          } catch (error) {
            Alert.alert("Error", "Failed to delete");
            setWorkouts(previousWorkouts);
          }
        } 
      }
    ]);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDuration('');
    setKcal('');
    Keyboard.dismiss();
  };

  const handleEdit = (item: Workout) => {
    if (!item.id) return;
    setTitle(item.title);
    setDuration(item.duration);
    setKcal(item.kcal);
    setEditingId(item.id); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Workouts</Text>
      </View>

      {/* Form using Components */}
      <View style={styles.formContainer}>
        <InputField 
          label="Workout Name" 
          placeholder="e.g. Morning Jog" 
          value={title} 
          onChangeText={setTitle} 
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <InputField 
              label="Duration (mins)" 
              placeholder="30" 
              value={duration} 
              onChangeText={setDuration} 
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputField 
              label="Calories" 
              placeholder="200" 
              value={kcal} 
              onChangeText={setKcal} 
              keyboardType="numeric"
            />
          </View>
        </View>

        <PrimaryButton 
          title={editingId ? "Update Workout" : "Add Workout"} 
          onPress={handleSave}
          // Edit කරනකොට පාට වෙනස් වෙන්න ඕන නිසා style එකක් දාමු
          style={editingId ? { backgroundColor: '#FFA500' } : {}}
        />

        {editingId && (
          <TouchableOpacity onPress={resetForm} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.listTitle}>My Plans</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          // 👇 WorkoutCard එක පාවිච්චි කළා
          renderItem={({ item }) => (
            <WorkoutCard 
              title={item.title}
              duration={item.duration}
              kcal={item.kcal}
              onEdit={() => handleEdit(item)}
              onDelete={item.id ? () => handleDelete(item.id!) : undefined}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No custom workouts yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 50 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  formContainer: { backgroundColor: COLORS.card, padding: 20, borderRadius: 20, marginBottom: 25 },
  row: { flexDirection: 'row' },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#888', fontSize: 14 },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  emptyText: { color: COLORS.gray, textAlign: 'center', marginTop: 20, fontStyle: 'italic' }
});