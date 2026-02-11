import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage Imports
import { auth, db } from '../config/firebase';

// ==========================================
// 1. User විස්තර ලබාගැනීම (Fetch User Data)
// ==========================================
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

// ==========================================
// 2. Profile Photo එක Upload කිරීම (Upload Image)
// ==========================================
export const uploadProfileImage = async (userId: string, uri: string) => {
  try {
    // A. Image එක Blob (File) එකක් බවට හරවනවා
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // B. Firebase Storage එකේ තැනක් හදනවා
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${userId}`);
    
    // C. Upload කරනවා
    await uploadBytes(storageRef, blob);
    
    // D. Upload වුන Link එක (Download URL) ගන්නවා
    const downloadURL = await getDownloadURL(storageRef);
    
    // E. User Profile එක Update කරනවා (URL එක Save කරන්න)
    await updateUserData(userId, undefined, downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// ==========================================
// 3. User විස්තර යාවත්කාලීන කිරීම (Update Name/Photo)
// ==========================================
export const updateUserData = async (userId: string, name?: string, photoURL?: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const updateData: any = {};
    
    // නම වෙනස් කරලා නම් විතරක් Add කරන්න
    if (name) updateData.name = name;
    
    // Photo එක වෙනස් කරලා නම් විතරක් Add කරන්න
    if (photoURL) updateData.photoURL = photoURL;

    // A. Firestore Database එක Update කරනවා
    await updateDoc(userRef, updateData);

    // B. Firebase Auth Profile එකත් Update කරනවා (App එක පුරාම පෙන්නන්න)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ==========================================
// 4. User ගේ ශරීර විස්තර Save කිරීම (Onboarding Data - NEW ✅)
// ==========================================
// මෙය තමයි ඔයාගේ Age, Weight, Height Save කරන්න පාවිච්චි කරන්නේ
export const saveUserStats = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Database එක Update කරනවා
    await updateDoc(userRef, {
      age: data.age,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      fitnessLevel: data.level, // fitnessLevel හෝ level ලෙස Save වෙයි
      isOnboardingComplete: true // Onboarding ඉවරයි කියලා මාර්ක් කරනවා
    });

    return true;
  } catch (error) {
    console.error("Error saving stats:", error);
    throw error;
  }
};