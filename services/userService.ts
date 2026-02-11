import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';

// 1. User විස්තර ලබාගැනීම
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// 2. User විස්තර යාවත්කාලීන කිරීම (Update)
export const updateUserData = async (userId: string, name: string) => {
  try {
    // A. Firestore Database එක Update කරනවා
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: name
    });

    // B. Auth Profile එකත් Update කරනවා (Login නම වෙනස් වෙන්න)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};