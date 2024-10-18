// src/redux/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        taskList: [],
    },
    reducers: {
        setTasks: (state, action) => {
            state.taskList = action.payload;
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
    },
});

// Export actions
export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;

// Export the reducer
export default tasksSlice.reducer;
