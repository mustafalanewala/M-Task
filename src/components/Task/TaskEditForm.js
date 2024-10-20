// src/components/Task/TaskEditForm.js
import React, { useState, useEffect } from 'react';
import { updateTask } from '../../firebase/taskService';
import { useDispatch } from 'react-redux';
import { updateTask as updateTaskAction } from '../../redux/tasksSlice';
import { auth } from '../../firebase/firebaseConfig'; // Import auth
import { toast } from 'react-toastify'; // Import toast

const TaskEditForm = ({ task, onClose }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (task) {
            setTaskName(task.name);
            setDescription(task.description);
            setCategory(task.category);
            setDueDate(task.dueDate);
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = auth.currentUser.uid; // Ensure userId is available
        const updatedTask = {
            id: task.id,
            name: taskName,
            description: description,
            category: category,
            dueDate: dueDate,
            status: task.status, // Preserving the current status
        };
        console.log('Updated Task:', updatedTask); // Debugging log
        try {
            await updateTask(userId, task.id, updatedTask); // Pass userId
            dispatch(updateTaskAction(updatedTask)); // Update Redux state
            onClose(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating task:', error.message); // More informative log
            toast.error('Failed to update task: ' + error.message); // Notify the user
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Edit Task</h2>
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
                Update Task
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Cancel
            </button>
        </form>
    );
};

export default TaskEditForm;
