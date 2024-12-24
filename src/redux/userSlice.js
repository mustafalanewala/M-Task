// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isAuthenticated: false,
  },
  reducers: {
    //Sets user information and updates authentication status.
    setUser: (state, action) => {
      const { payload } = action; // Destructure payload
      state.userInfo = payload || null;
      state.isAuthenticated = Boolean(payload); // Convert to boolean
    },
    // Clears user information and resets authentication status.
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
