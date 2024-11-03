// src/firebase/taskService.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

// Fetch user tasks
export const fetchUserTasks = async (userId) => {
  try {
    const tasksCollection = collection(db, `users/${userId}/tasks`);
    const tasksSnapshot = await getDocs(tasksCollection);
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    toast.error("Failed to load tasks. Please try again.");
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
    toast.error("Failed to add task. Please try again.");
    throw error;
  }
};

// Update task
export const updateTask = async (userId, id, updatedTask) => {
  try {
    console.log("Updated Task:", updatedTask);

    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    console.log("Document Path:", taskDoc.path);

    // Filter out undefined values from updatedTask
    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedTask).filter(([_, v]) => v !== undefined)
    );

    // Check if there are valid updates
    if (Object.keys(filteredUpdates).length > 0) {
      await updateDoc(taskDoc, filteredUpdates);
    } else {
      console.warn("No valid fields to update.");
      toast.info("No updates were made to the task.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    console.error("Error details:", error.message);
    toast.error("Failed to update task. Please try again.");
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
    toast.error("Failed to delete task. Please try again.");
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
    toast.error("Failed to update task status. Please try again.");
    throw error;
  }
};
