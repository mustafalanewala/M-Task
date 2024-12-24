// src/firebase/taskService.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "./firebaseConfig";

// Retrieves all tasks for a specific user from the Firestore database
export const fetchUserTasks = async (userId) => {
  try {
    const tasksCollection = collection(db, `users/${userId}/tasks`);
    const tasksSnapshot = await getDocs(tasksCollection);

    // Map over documents and return task data with document IDs
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    toast.error("Failed to load tasks. Please refresh and try again.");
    throw error;
  }
};

// Adds a new task to the user's tasks collection
export const addTask = async (userId, task) => {
  try {
    const tasksCollection = collection(db, `users/${userId}/tasks`);
    await addDoc(tasksCollection, task);
    toast.success("Task added successfully!");
  } catch (error) {
    console.error("Error adding task:", error);
    toast.error("Failed to add task. Please refresh and try again.");
    throw error;
  }
};

// Updates specific fields of a task in the Firestore database
export const updateTask = async (userId, id, updatedTask) => {
  try {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);

    // Filter out undefined or invalid values from the update payload
    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedTask).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredUpdates).length > 0) {
      await updateDoc(taskDoc, filteredUpdates);
      toast.success("Task updated successfully!");
    } else {
      console.warn("No valid fields to update.");
      toast.info("No updates were made to the task.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task. Please refresh and try again.");
    throw error;
  }
};

// Deletes a task from the user's tasks collection
export const deleteTask = async (userId, id) => {
  try {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await deleteDoc(taskDoc);
    toast.success("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task. Please refresh and try again.");
    throw error;
  }
};

// Updates the status field of a task
export const updateTaskStatus = async (userId, id, status) => {
  try {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await updateDoc(taskDoc, { status });
    toast.success("Task status updated successfully!");
  } catch (error) {
    console.error("Error updating task status:", error);
    toast.error("Failed to update task status. Please refresh and try again.");
    throw error;
  }
};

// Marks a task as archived by updating the `archived` field
export const archiveTask = async (userId, id) => {
  try {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await updateDoc(taskDoc, { archived: true });
    toast.success("Task archived successfully!");
  } catch (error) {
    console.error("Error archiving task:", error);
    toast.error("Failed to archive task. Please refresh and try again.");
    throw error;
  }
};

// Removes the archived status of a task
export const unarchiveTask = async (userId, id) => {
  try {
    const taskDoc = doc(db, `users/${userId}/tasks`, id);
    await updateDoc(taskDoc, { archived: false });
    toast.success("Task unarchived successfully!");
  } catch (error) {
    console.error("Error unarchiving task:", error);
    toast.error("Failed to unarchive task. Please refresh and try again.");
    throw error;
  }
};
