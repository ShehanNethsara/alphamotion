import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import COLORS from '../../constants/Colors';
import { getWorkoutStats, WorkoutLog } from '../../services/workoutService';

export default function ReportScreen() {
  const auth = getAuth();
  
  // State එක වෙනස් කළා Today & Total දෙකම තියාගන්න
  const [stats, setStats] = useState({
    today: { workouts: 0, minutes: 0, calories: 0 },
    total: { workouts: 0, minutes: 0, calories: 0 },
    history: [] as WorkoutLog[]
  });
  
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    if (!auth.currentUser) return;
    // setLoading(true); // Refresh වෙනකොට කැරකෙන එක ඕන නම් Uncomment කරන්න
    const data = await getWorkoutStats(auth.currentUser.uid);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading && stats.history.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.gray, marginTop: 10 }}>Loading Daily Progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Progress 🔥</Text>
        <Text style={styles.headerSub}>{new Date().toDateString()}</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={() => { setLoading(true); loadStats(); }} 
            tintColor={COLORS.primary} 
          />
        }
      >
        {/* --- Today's Stats Cards --- */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={28} color="#FFD700" />
            {/* මෙතන දැම්මේ අද දවසේ ගණන */}
            <Text style={styles.statNumber}>{stats.today.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color="#FF4500" />
            <Text style={styles.statNumber}>{stats.today.calories}</Text>
            <Text style={styles.statLabel}>Today Kcal</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={28} color="#00BFFF" />
            <Text style={styles.statNumber}>{stats.today.minutes}</Text>
            <Text style={styles.statLabel}>Today Mins</Text>
          </View>
        </View>

        {/* --- History List --- */}
        <Text style={styles.sectionTitle}>Recent History</Text>
        
        {stats.history.length === 0 ? (
          <Text style={styles.emptyText}>No workouts yet today. Go train! 💪</Text>
        ) : (
          stats.history.map((log, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name="checkmark-done" size={20} color="#000" />
                </View>
                <View>
                  <Text style={styles.historyTitle}>{log.workoutTitle}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(log.date).toLocaleDateString()} • {new Date(log.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                 <Text style={styles.historyVal}>{log.kcal} Kcal</Text>
                 <Text style={styles.historyValSub}>{log.duration} Mins</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 50 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: COLORS.gray, marginTop: 5 },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { 
    backgroundColor: COLORS.card, 
    width: '31%', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
  statLabel: { color: COLORS.gray, fontSize: 12 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  historyItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: COLORS.card, 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10 
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 35, height: 35, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  historyTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  historyDate: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  historyVal: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  historyValSub: { color: COLORS.gray, fontSize: 12 },
  emptyText: { color: COLORS.gray, textAlign: 'center', marginTop: 20, fontStyle: 'italic' }
});