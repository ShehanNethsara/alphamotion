import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';

import COLORS from '../../constants/Colors';
import { 
  addCustomWorkout, 
  getUserWorkouts, 
  deleteCustomWorkout, 
  updateCustomWorkout, 
  Workout 
} from '../../services/workoutService';

export default function AddWorkoutScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  // --- States ---
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [kcal, setKcal] = useState('');
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- Initial Data Load ---
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

  // --- Functions ---

  // 1. Save (Add or Update) with Instant UI Update
  const handleSave = async () => {
    if (!title || !duration || !kcal) {
      Alert.alert('Missing Fields', 'Please fill all details');
      return;
    }

    if (!user) {
      Alert.alert("Error", "You are not logged in!");
      return;
    }

    const newWorkoutData = { userId: user.uid, title, duration, kcal };
    const tempId = Date.now().toString(); // Temporary ID for UI

    try {
      if (editingId) {
        // === UPDATE ===
        // UI Update First
        setWorkouts(prev => prev.map(item => item.id === editingId ? { ...item, ...newWorkoutData } : item));
        
        // Reset Form
        const currentEditId = editingId;
        setEditingId(null);
        setTitle('');
        setDuration('');
        setKcal('');
        Keyboard.dismiss();

        // Server Call
        await updateCustomWorkout(currentEditId, newWorkoutData);
      } else {
        // === CREATE ===
        // UI Update First
        const optimisticItem = { id: tempId, ...newWorkoutData };
        setWorkouts(prev => [...prev, optimisticItem]);

        // Reset Form
        setTitle('');
        setDuration('');
        setKcal('');
        Keyboard.dismiss();

        // Server Call
        const savedWorkout = await addCustomWorkout(newWorkoutData);

        // Update ID from Server
        setWorkouts(prev => prev.map(item => item.id === tempId ? { ...item, id: savedWorkout.id } : item));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save workout');
      fetchWorkouts(); // Revert changes on error
    }
  };

  // 2. Delete with Instant UI Update
  const handleDelete = (id: string) => {
    Alert.alert("Delete Workout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          const previousWorkouts = [...workouts];
          // UI Update First
          setWorkouts(prev => prev.filter(item => item.id !== id));

          if (editingId === id) {
            setEditingId(null);
            setTitle('');
            setDuration('');
            setKcal('');
          }

          try {
            // Server Call
            await deleteCustomWorkout(id);
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to delete");
            setWorkouts(previousWorkouts); // Revert on error
          }
        } 
      }
    ]);
  };

  // 3. Prepare for Edit
  const handleEdit = (item: Workout) => {
    if (!item.id) return;
    setTitle(item.title);
    setDuration(item.duration);
    setKcal(item.kcal);
    setEditingId(item.id); 
  };

  // --- Render UI ---
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Workouts</Text>
      </View>

      {/* Input Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Workout Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Morning Jog" 
          placeholderTextColor={COLORS.gray}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Duration (mins)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="30" 
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Calories</Text>
            <TextInput 
              style={styles.input} 
              placeholder="200" 
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
              value={kcal}
              onChangeText={setKcal}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, editingId ? { backgroundColor: '#FFA500' } : {}]} 
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {editingId ? "Update Workout" : "Add Workout"}
          </Text>
        </TouchableOpacity>

        {editingId && (
          <TouchableOpacity onPress={() => {
            setEditingId(null);
            setTitle('');
            setDuration('');
            setKcal('');
            Keyboard.dismiss();
          }} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List Area */}
      <Text style={styles.listTitle}>My Plans</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.duration} mins • {item.kcal} Kcal</Text>
              </View>
              
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
                  <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
                
                {item.id && (
                  <TouchableOpacity onPress={() => handleDelete(item.id!)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 50,
  },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  formContainer: { backgroundColor: COLORS.card, padding: 20, borderRadius: 20, marginBottom: 25 },
  label: { color: '#fff', fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#333', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#444' },
  row: { flexDirection: 'row' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 5 },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
  cancelText: { color: '#888', fontSize: 14 },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 15, borderRadius: 15, marginBottom: 10, justifyContent: 'space-between' },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: COLORS.gray, fontSize: 14, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 15 },
  iconBtn: { padding: 5 },
  emptyText: { color: COLORS.gray, textAlign: 'center', marginTop: 20, fontStyle: 'italic' }
});