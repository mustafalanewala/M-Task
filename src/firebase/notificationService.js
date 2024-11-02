// src/firebase/notificationService.js
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Fetch user notifications
export const fetchUserNotifications = async (userId) => {
    const notificationsCollection = collection(db, `users/${userId}/notifications`);
    const notificationsSnapshot = await getDocs(notificationsCollection);
    return notificationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
