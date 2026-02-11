import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit // 👈 Data Limit කරන්න මේක ඕන
} from 'firebase/firestore';
import { db } from '../config/firebase';

// --- Types ---
export interface Workout {
  id?: string;
  userId: string;
  title: string;
  duration: string;
  kcal: string;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  workoutTitle: string;
  duration: number; 
  kcal: number;
  date: string; 
}

// ==========================================
// 1. CUSTOM WORKOUTS (CRUD)
// ==========================================

export const addCustomWorkout = async (workout: Workout) => {
  try {
    const docRef = await addDoc(collection(db, 'userWorkouts'), workout);
    return { ...workout, id: docRef.id };
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};

export const getUserWorkouts = async (userId: string) => {
  try {
    const q = query(collection(db, 'userWorkouts'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};

export const updateCustomWorkout = async (id: string, updatedData: Partial<Workout>) => {
  try {
    const workoutRef = doc(db, 'userWorkouts', id);
    await updateDoc(workoutRef, updatedData);
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error;
  }
};

export const deleteCustomWorkout = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'userWorkouts', id));
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error;
  }
};

// ==========================================
// 2. REPORT SYSTEM (LOGS & STATS) - FAST ⚡
// ==========================================

export const logCompletedWorkout = async (userId: string, workoutTitle: string, durationStr: string, kcalStr: string) => {
  try {
    const logData: WorkoutLog = {
      userId,
      workoutTitle: workoutTitle || "Workout",
      duration: parseInt(durationStr) || 0, 
      kcal: parseInt(kcalStr) || 0,         
      date: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'workoutLogs'), logData);
    console.log("Workout Logged Successfully!");
  } catch (error) {
    console.error("Error logging workout:", error);
  }
};

// Report Page එකට Data ගන්න Function එක (Optimized)
export const getWorkoutStats = async (userId: string) => {
  try {
    // 🔥 වේගවත් කිරීම: අන්තිම 50 විතරක් ගන්නවා.
    // මුළු ලිස්ට් එකම ගත්තොත් පස්සේ කාලෙක ඇප් එක ස්ලෝ වෙනවා.
    const q = query(
      collection(db, 'workoutLogs'), 
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(50) 
    );

    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => doc.data() as WorkoutLog);

    // --- DATE CALCULATION ---
    const todayStr = new Date().toDateString(); // "Fri Jan 31 2026"

    // අද දවසට අදාළ ඒවා ෆිල්ටර් කරනවා
    const todayLogs = logs.filter(log => new Date(log.date).toDateString() === todayStr);

    // 1. අද දවසේ එකතුව (Today's Stats)
    const todayWorkouts = todayLogs.length;
    const todayMinutes = todayLogs.reduce((sum, item) => sum + item.duration, 0);
    const todayCalories = todayLogs.reduce((sum, item) => sum + item.kcal, 0);

    // 2. පෙන්නන ලිස්ට් එකේ එකතුව (Total of loaded logs)
    const totalWorkouts = logs.length;
    const totalMinutes = logs.reduce((sum, item) => sum + item.duration, 0);
    const totalCalories = logs.reduce((sum, item) => sum + item.kcal, 0);

    return {
      today: {
        workouts: todayWorkouts,
        minutes: todayMinutes,
        calories: todayCalories
      },
      total: {
        workouts: totalWorkouts,
        minutes: totalMinutes,
        calories: totalCalories
      },
      history: logs
    };

  } catch (error: any) {
    console.error("Error getting stats:", error);
    
    // 👇 මේක ඉතාම වැදගත්: Index Error එකක් ආවොත් ලින්ක් එක Console එකේ පෙන්නන්න
    if (error.message && error.message.includes("index")) {
        console.log("⚠️ FIREBASE INDEX REQUIRED: Please check the link in your terminal/console to create the index!");
        console.log("Link eka click karanna: ", error.message);
    }
    
    return { 
      today: { workouts: 0, minutes: 0, calories: 0 }, 
      total: { workouts: 0, minutes: 0, calories: 0 }, 
      history: [] 
    };
  }
};