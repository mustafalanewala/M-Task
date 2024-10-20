// src/firebase/taskService.js
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore'; // Added deleteDoc

// Fetch user tasks
export const fetchUserTasks = async (userId) => {
    const tasksCollection = collection(db, `users/${userId}/tasks`);
    const tasksSnapshot = await getDocs(tasksCollection);
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add task
export const addTask = async (userId, task) => {
    const tasksCollection = collection(db, `users/${userId}/tasks`);
    await addDoc(tasksCollection, task);
};

// Update task
export const updateTask = async (userId, id, updatedTask) => {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await updateDoc(taskDoc, updatedTask);
};

// Delete task
export const deleteTask = async (userId, id) => {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await deleteDoc(taskDoc);
};

// Update task status
export const updateTaskStatus = async (userId, id, status) => {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await updateDoc(taskDoc, { status });
};
