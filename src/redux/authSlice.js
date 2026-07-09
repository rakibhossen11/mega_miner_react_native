import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,         // ইউজারের নাম, ইমেইল, আইডি ইত্যাদি থাকবে
  token: null,        // ব্যাকএন্ড থেকে আসা JWT বা সেশন টোকেন
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token; // টোকেনটি সেভ হলো
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;