// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice'; 
import userReducer from './userSlice'; 

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        user: userReducer,
    },
});

export default store;
