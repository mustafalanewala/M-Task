// src/components/Task/TaskForm.js
import React, { useState } from 'react';
import { addTask } from '../../firebase/taskService';
import { useDispatch } from 'react-redux';
import { addTask as addTaskAction } from '../../redux/tasksSlice';
import { useAuthState } from "react-firebase-hooks/auth"; // Correct import for useAuthState
import { auth } from '../../firebase/firebaseConfig'; // Import your auth configuration
import { toast } from 'react-toastify'; // Optional: for notifications

const TaskForm = ({ onClose }) => { // Accept onClose prop
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');
    const dispatch = useDispatch();
    const [user] = useAuthState(auth); // Get the current user

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = {
            name: taskName,
            description: description,
            category: category,
            dueDate: dueDate,
            completed: false,
        };

        try {
            if (user) { // Check if the user is authenticated
                const taskId = await addTask(user.uid, newTask); // Pass user ID
                dispatch(addTaskAction({ id: taskId, ...newTask }));
                toast.success("Task added successfully!"); // Notify success
                onClose(); // Close modal after adding task
                // Clear form fields
                setTaskName('');
                setDescription('');
                setCategory('');
                setDueDate('');
            } else {
                console.error('User is not authenticated');
                toast.error("You need to be logged in to add a task."); // Notify error
            }
        } catch (error) {
            console.error('Error adding task:', error);
            toast.error("Failed to add task: " + error.message); // Notify error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Add New Task</h2>
            <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                className="border border-gray-300 rounded py-2 px-3 w-full"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded py-2 px-3 w-full"
            />
            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border border-gray-300 rounded py-2 px-3 w-full"
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-gray-300 rounded py-2 px-3 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                Add Task
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Cancel
            </button>
        </form>
    );
};

export default TaskForm;
