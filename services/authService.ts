import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../config/firebase'; 

//  Register User
export const registerUser = async (email: string, pass: string, name: string) => {
  try {
    console.log("1. Starting Registration..."); 

    //  Auth Create
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    console.log("2. Auth User Created:", user.uid); 

    //  Profile Update
    await updateProfile(user, { displayName: name });
    console.log("3. Profile Name Updated");

    //  Database Save
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });
    console.log("4. Database Saved Successfully!"); 

    return user;

  } catch (error: any) {
    console.error("REGISTRATION FAILED AT:", error.code, error.message);
    throw error; // send error to caller for UI handling
  }
};

export const loginUser = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};