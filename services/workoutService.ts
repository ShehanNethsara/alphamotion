import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase'; // ඔයාගේ config path එක

// Data Type එක නිර්වචනය කිරීම
export interface Workout {
  id?: string;
  userId: string;
  title: string;
  duration: string;
  kcal: string;
}

// 1. Create (Add)
export const addCustomWorkout = async (workout: Workout) => {
  try {
    const docRef = await addDoc(collection(db, 'userWorkouts'), workout);
    return { ...workout, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// 2. Read (Get All by User ID)
export const getUserWorkouts = async (userId: string) => {
  try {
    const q = query(collection(db, 'userWorkouts'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    // ID එක ඩේටා එකත් එක්ක හරියට map කරගැනීම
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Workout));
  } catch (error) {
    console.error("Error fetching documents: ", error);
    throw error;
  }
};

// 3. Update
export const updateCustomWorkout = async (id: string, updatedData: Partial<Workout>) => {
  try {
    const workoutRef = doc(db, 'userWorkouts', id);
    await updateDoc(workoutRef, updatedData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// 4. Delete
export const deleteCustomWorkout = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'userWorkouts', id));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};