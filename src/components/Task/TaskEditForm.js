// src/components/Task/TaskEditForm.js
import React, { useState, useEffect } from 'react';
import { updateTask } from '../../firebase/taskService';
import { useDispatch } from 'react-redux';
import { updateTask as updateTaskAction } from '../../redux/tasksSlice';

const TaskEditForm = ({ task, onClose }) => {
    const [taskName, setTaskName] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (task) {
            setTaskName(task.name);
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTask = { ...task, name: taskName };
        try {
            await updateTask(task.id, updatedTask);
            dispatch(updateTaskAction(updatedTask)); // Update Redux state
            onClose(); // Close the form after updating
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-edit-form">
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
            />
            <button type="submit" className="btn-update-task">Update Task</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        </form>
    );
};

export default TaskEditForm;
