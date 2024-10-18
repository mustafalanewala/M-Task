// src/firebase/taskService.js
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Function to add a new task
export const addTask = async (task) => {
    try {
        const docRef = await addDoc(collection(db, 'tasks'), task);
        return { id: docRef.id, ...task };
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

// Function to fetch all tasks
export const fetchTasks = async () => {
    const tasksCol = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksCol);
    const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return taskList;
};

// Function to update a task
export const updateTask = async (id, updatedTask) => {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, updatedTask);
};

// Function to delete a task
export const deleteTask = async (id) => {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
};
