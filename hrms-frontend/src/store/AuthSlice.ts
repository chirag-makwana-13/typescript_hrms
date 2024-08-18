// src/AuthSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  firstName: null,
  lastName: null,
  userId: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role; // Adjust based on your payload structure
      state.firstName = action.payload.firstName; // Adjust based on your payload structure
      state.lastName = action.payload.lastName; // Adjust based on your payload structure
      state.userId = action.payload.userId; // Adjust based on your payload structure
      state.profile = action.payload.profile; // Adjust based on your payload structure
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.firstName = null;
      state.lastName = null;
      state.role = null;
      state.userId = null;
      state.profile = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
