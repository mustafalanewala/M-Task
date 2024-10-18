// src/firebase/auth.js
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { setUser, clearUser } from '../redux/userSlice'; // Import Redux actions
import store from '../redux/store'; // Import store

const provider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Dispatch the user information to Redux store
        store.dispatch(setUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
        }));

        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error; 
    }
};

// Function to sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        // Clear user information from Redux store
        store.dispatch(clearUser());
    } catch (error) {
        console.error("Error signing out:", error);
        throw error; 
    }
};