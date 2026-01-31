import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy
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
  duration: number; // ගණන් හදන්න පහසු වෙන්න Number ලෙස
  kcal: number;
  date: string; // ISO String (Date & Time)
}

// ==========================================
// 1. CUSTOM WORKOUTS (CRUD)
// ==========================================

// Add Workout
export const addCustomWorkout = async (workout: Workout) => {
  try {
    const docRef = await addDoc(collection(db, 'userWorkouts'), workout);
    return { ...workout, id: docRef.id };
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};

// Get All Workouts
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

// Update Workout
export const updateCustomWorkout = async (id: string, updatedData: Partial<Workout>) => {
  try {
    const workoutRef = doc(db, 'userWorkouts', id);
    await updateDoc(workoutRef, updatedData);
  } catch (error) {
    console.error("Error updating workout:", error);
    throw error;
  }
};

// Delete Workout
export const deleteCustomWorkout = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'userWorkouts', id));
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error;
  }
};

// ==========================================
// 2. REPORT SYSTEM (LOGS & STATS)
// ==========================================

// Workout එකක් ඉවර වුනාම Save කරන Function එක
export const logCompletedWorkout = async (userId: string, workoutTitle: string, durationStr: string, kcalStr: string) => {
  try {
    const logData: WorkoutLog = {
      userId,
      workoutTitle: workoutTitle || "Workout",
      duration: parseInt(durationStr) || 0, // String -> Number
      kcal: parseInt(kcalStr) || 0,         // String -> Number
      date: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'workoutLogs'), logData);
    console.log("Workout Logged Successfully!");
  } catch (error) {
    console.error("Error logging workout:", error);
  }
};

// Report Page එකට Data ගන්න Function එක (Today vs Total)
export const getWorkoutStats = async (userId: string) => {
  try {
    // 1. Database එකෙන්ම Sort කරලා ඉල්ලනවා (අලුත් ඒවා උඩට)
    const q = query(
      collection(db, 'workoutLogs'), 
      where("userId", "==", userId),
      orderBy("date", "desc") 
    );

    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => doc.data() as WorkoutLog);

    // --- DATE CALCULATION (අද දවස හොයාගැනීම) ---
    const todayStr = new Date().toDateString(); // උදා: "Fri Jan 31 2026"

    // අද දවසට අදාළ ඒවා විතරක් ෆිල්ටර් කරනවා
    const todayLogs = logs.filter(log => new Date(log.date).toDateString() === todayStr);

    // 2. අද දවසේ එකතුව (Today's Stats)
    const todayWorkouts = todayLogs.length;
    const todayMinutes = todayLogs.reduce((sum, item) => sum + item.duration, 0);
    const todayCalories = todayLogs.reduce((sum, item) => sum + item.kcal, 0);

    // 3. මුළු ජීවිත කාලෙම එකතුව (Total Stats - අවශ්‍ය නම් පාවිච්චි කරන්න)
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
      history: logs // ලිස්ට් එකට ඔක්කොම යවනවා
    };

  } catch (error: any) {
    console.error("Error getting stats:", error);
    
    // ⚠️ වැදගත්: Index Error එකක් ආවොත් ලින්ක් එක Console එකේ පෙන්නන්න
    if (error.message && error.message.includes("index")) {
        console.log("⚠️ FIREBASE INDEX REQUIRED: Please check the link in your terminal console.");
    }
    
    // Error ආවොත් බිංදුව යවනවා
    return { 
      today: { workouts: 0, minutes: 0, calories: 0 }, 
      total: { workouts: 0, minutes: 0, calories: 0 }, 
      history: [] 
    };
  }
};