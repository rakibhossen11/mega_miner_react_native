import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
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
      state.token = action.payload.token; // সার্ভার থেকে আসা টোকেনটি সেভ হলো
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




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // 🌐 ১. Async Thunk তৈরি করা (Axios দিয়ে এক্সপ্রেস সার্ভারে ডেটা পাঠানো)
// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (userData, { rejectWithValue }) => {
//     try {
//       // ⚠️ এখানে আপনার এক্সপ্রেস সার্ভারের আইপি (IP) ও পোর্ট দিন (যেমন: Login এ ব্যবহার করেছিলেন)
//       const response = await axios.post('http://192.168.0.109:3000/api/auth/register', userData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       // সার্ভার থেকে সফল রেসপন্স আসলে ডেটা রিটার্ন হবে
//       return response.data; 
//     } catch (error) {
//       // সার্ভার কোনো এরর মেসেজ দিলে তা ক্যাচ করা
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data.error || 'Registration failed');
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   user: null,         // ইউজারের নাম, ইমেইল, আইডি ইত্যাদি থাকবে
//   token: null,        // ব্যাকএন্ড থেকে আসা JWT বা সেশন টোকেন
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     authStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     authSuccess: (state, action) => {
//       state.loading = false;
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.token = action.payload.token; // টোকেনটি সেভ হলো
//     },
//     authFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//       state.isAuthenticated = false;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//     },
//   },
// });

// export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
// export default authSlice.reducer;