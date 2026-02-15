import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';


const CLOUD_NAME = "dzle4zmly"; 
const UPLOAD_PRESET = "Shehen_Nethsara"; 

// User details
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

//Profile Photo  Upload  
export const uploadProfileImage = async (userId: string, uri: string) => {
  try {
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    data.append('upload_preset', UPLOAD_PRESET);
    data.append('cloud_name', CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'post',
      body: data
    });

    const result = await res.json();

    if (result.secure_url) {
      const downloadURL = result.secure_url;
      // Database Update
      await updateUserData(userId, undefined, downloadURL);
      return downloadURL;
    } else {
      throw new Error("Cloudinary upload failed");
    }

  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

//  User details Update 
export const updateUserData = async (userId: string, name?: string, photoURL?: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (photoURL) updateData.photoURL = photoURL;

    await setDoc(userRef, updateData, { merge: true });

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

// Save User Stats 
export const saveUserStats = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await setDoc(userRef, {
      age: data.age,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      fitnessLevel: data.level, 
      isOnboardingComplete: true 
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error saving stats:", error);
    throw error;
  }
};