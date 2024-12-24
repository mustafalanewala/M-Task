// src/redux/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Redux slice for managing tasks
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        taskList: [], 
        archivedTasks: [],
    },
    reducers: {
        // Set tasks, splitting them into active and archived categories
        setTasks: (state, action) => {
            const tasks = action.payload;
            state.taskList = tasks.filter(task => !task.archived);
            state.archivedTasks = tasks.filter(task => task.archived);
        },

        // Add a new task to the active task list
        addTask: (state, action) => {
            state.taskList.push(action.payload);
        },

        // Update an existing task based on its ID
        updateTask: (state, action) => {
            const taskIndex = state.taskList.findIndex(task => task.id === action.payload.id);
            if (taskIndex !== -1) {
                state.taskList[taskIndex] = {
                    ...state.taskList[taskIndex],
                    ...action.payload, // Merge updates
                };
            }
        },

        // Remove a task from the active task list
        deleteTask: (state, action) => {
            state.taskList = state.taskList.filter(task => task.id !== action.payload);
        },

        // Archive a task: move it from active to archived list
        archiveTask: (state, action) => {
            const taskIndex = state.taskList.findIndex(task => task.id === action.payload);
            if (taskIndex !== -1) {
                const [archivedTask] = state.taskList.splice(taskIndex, 1);
                archivedTask.archived = true; // Mark task as archived
                state.archivedTasks.push(archivedTask);
            }
        },

        // Unarchive a task: move it from archived back to active list
        unarchiveTask: (state, action) => {
            const taskIndex = state.archivedTasks.findIndex(task => task.id === action.payload);
            if (taskIndex !== -1) {
                const [unarchivedTask] = state.archivedTasks.splice(taskIndex, 1);
                unarchivedTask.archived = false; // Mark task as active
                state.taskList.push(unarchivedTask);
            }
        },
    },
});

// Export actions
export const { setTasks, addTask, updateTask, deleteTask, archiveTask, unarchiveTask } = tasksSlice.actions;

// Export reducer
export default tasksSlice.reducer;
