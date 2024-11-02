// src/firebase/taskService.js
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'; // Import toast for notifications

// Fetch user tasks
export const fetchUserTasks = async (userId) => {
    try {
        const tasksCollection = collection(db, `users/${userId}/tasks`);
        const tasksSnapshot = await getDocs(tasksCollection);
        return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        toast.error("Failed to load tasks. Please try again."); // User-friendly error message
        throw error; 
    }
};

// Add task
export const addTask = async (userId, task) => {
    try {
        const tasksCollection = collection(db, `users/${userId}/tasks`);
        await addDoc(tasksCollection, task);
    } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to add task. Please try again."); // User-friendly error message
        throw error; 
    }
};

// Update task
export const updateTask = async (userId, id, updatedTask) => {
    try {
        const taskDoc = doc(db, `users/${userId}/tasks`, id);
        await updateDoc(taskDoc, updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task. Please try again."); // User-friendly error message
        throw error; 
    }
};

// Delete task
export const deleteTask = async (userId, id) => {
    try {
        const taskDoc = doc(db, `users/${userId}/tasks`, id);
        await deleteDoc(taskDoc);
    } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task. Please try again."); // User-friendly error message
        throw error; 
    }
};

// Update task status
export const updateTaskStatus = async (userId, id, status) => {
    try {
        const taskDoc = doc(db, `users/${userId}/tasks`, id);
        await updateDoc(taskDoc, { status });
    } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status. Please try again."); // User-friendly error message
        throw error; 
    }
};
