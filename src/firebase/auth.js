// src/firebase/auth.js
import { auth } from "./firebaseConfig"; // Firebase authentication instance
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; // Firebase methods
import { setUser, clearUser } from "../redux/userSlice";
import store from "../redux/store";

// Initialize the GoogleAuthProvider
const provider = new GoogleAuthProvider();

// Signs in user using Google Authentication. Uses Firebase's `signInWithPopup` to authenticate the user.
// Dispatches user details to Redux store on successful authentication.

export const signInWithGoogle = async () => {
  try {
    // Trigger Google sign-in popup
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user)
      throw new Error("Authentication failed: User object is undefined.");

    // Dispatch user details to the Redux store
    store.dispatch(
      setUser({
        uid: user.uid || null,
        displayName: user.displayName || "Anonymous",
        email: user.email || "No Email Provided",
        photoURL: user.photoURL || "",
      })
    );

    return user;
  } catch (error) {
    // Log the error and rethrow it for higher-level handling
    console.error(
      `[Auth Error] Failed to sign in with Google: ${error.message}`
    );
    throw new Error("Unable to sign in with Google. Please try again later.");
  }
};

// Signs out the authenticated user. Clears the user information from the Redux store.
export const signOutUser = async () => {
  try {
    // Trigger sign-out process
    await signOut(auth);

    // Clear user details from the Redux store
    store.dispatch(clearUser());
  } catch (error) {
    // Log the error and rethrow it for higher-level handling
    console.error(`[Auth Error] Failed to sign out: ${error.message}`);
    throw new Error("Unable to sign out. Please try again later.");
  }
};
