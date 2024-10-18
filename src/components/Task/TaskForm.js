// src/components/Task/TaskForm.js
import React, { useState } from 'react';
import { addTask } from '../../firebase/taskService';
import { useDispatch } from 'react-redux';
import { addTask as addTaskAction } from '../../redux/tasksSlice';

const TaskForm = () => {
    const [taskName, setTaskName] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = { name: taskName, completed: false };
        try {
            const addedTask = await addTask(newTask);
            dispatch(addTaskAction(addedTask)); // Update Redux state
            setTaskName(''); // Clear input field
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                required
            />
            <button type="submit" className="btn-add-task">Add Task</button>
        </form>
    );
};

export default TaskForm;
