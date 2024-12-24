// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice'; 
import userReducer from './userSlice'; 


const store = configureStore({
    // Define reducers for state slices
    reducer: {
        tasks: tasksReducer, 
        user: userReducer,  
    },
    // Disable dev tools and immutability checks in production for better performance
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;
