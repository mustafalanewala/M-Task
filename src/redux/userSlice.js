// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearUser: (state) => {
            state.userInfo = null;
            state.isAuthenticated = false;
        },
    },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
