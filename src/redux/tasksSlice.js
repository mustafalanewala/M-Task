// src/redux/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        taskList: [],
        archivedTasks: [], // Store archived tasks separately
    },
    reducers: {
        setTasks: (state, action) => {
            state.taskList = action.payload.filter(task => !task.archived);
            state.archivedTasks = action.payload.filter(task => task.archived);
        },
        addTask: (state, action) => {
            state.taskList.push(action.payload);
        },
        updateTask: (state, action) => {
            const index = state.taskList.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.taskList[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.taskList = state.taskList.filter(task => task.id !== action.payload);
        },
        archiveTask: (state, action) => {
            const taskToArchive = state.taskList.find(task => task.id === action.payload);
            if (taskToArchive) {
                taskToArchive.archived = true;
                state.archivedTasks.push(taskToArchive);
                state.taskList = state.taskList.filter(task => task.id !== action.payload);
            }
        },
        unarchiveTask: (state, action) => {
            const taskToUnarchive = state.archivedTasks.find(task => task.id === action.payload);
            if (taskToUnarchive) {
                taskToUnarchive.archived = false;
                state.taskList.push(taskToUnarchive);
                state.archivedTasks = state.archivedTasks.filter(task => task.id !== action.payload);
            }
        },
    },
});

// Export actions
export const { setTasks, addTask, updateTask, deleteTask, archiveTask, unarchiveTask } = tasksSlice.actions;

export default tasksSlice.reducer;
