import apiClient from './apiClient';
import { store } from '../redux/store';
import { authStart, authSuccess, authFailure } from '../redux/authSlice';

export const authService = {
  // 🔑 লগইন মেথড
  login: async (email, password) => {
    // console.log("auth service",email, password);
    store.dispatch(authStart()); // লোডিং ট্রু করা
    try {
      const response = await apiClient.post('auth/login', { email, password });
      // console.log("auth service",response);
      if (response.data.success) {
        // রেডাক্স স্টোরে ডাটা ও টোকেন স্টোর করা
        store.dispatch(authSuccess({ user: response.data.user, token: response.data.token }));
      }
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || "Network Error";
      store.dispatch(authFailure(msg));
      throw error;
    }
  },

  // 📝 রেজিস্ট্রেশন মেথড
  register: async (userData) => {
    console.log("auth service",userData);
    store.dispatch(authStart());
    try {
      const response = await apiClient.post('auth/register', userData);
      if (response.data.success) {
        store.dispatch(authSuccess({ user: response.data.user, token: response.data.token }));
      }
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.error || "Network Error";
      store.dispatch(authFailure(msg));
      throw error;
    }
  }
};



// import apiClient from './apiClient';
// import { store } from '../redux/store';
// import { authStart, authSuccess, authFailure } from '../redux/authSlice';

// export const authService = {
//   // 🔑 ১. লগইন ফাংশন
//   login: async (email, password) => {
//     store.dispatch(authStart());
//     try {
//       const response = await apiClient.post('/user/login', { email, password });
      
//       // ব্যাকএন্ড যদি সফল হয় (success: true) তবে রেডাক্সে ডাটা পুশ হবে
//       if (response.data.success) {
//         store.dispatch(authSuccess({
//           user: response.data.user,
//           token: response.data.token || 'dummy-secure-token-for-now' // ব্যাকএন্ড থেকে টোকেন না আসলে ডামি জেনারেট করবে
//         }));
//       }
//       return response.data;
//     } catch (error) {
//       const errorMsg = error.response ? error.response.data.error : "Network Error";
//       store.dispatch(authFailure(errorMsg));
//       throw error;
//     }
//   },

//   // 📝 ২. রেজিস্ট্রেশন ফাংশн
//   register: async (userData) => {
//     store.dispatch(authStart());
//     try {
//       const response = await apiClient.post('/user/register', userData);
//       if (response.data.success) {
//         store.dispatch(authSuccess({
//           user: response.data.user,
//           token: response.data.token || 'dummy-secure-token-for-now'
//         }));
//       }
//       return response.data;
//     } catch (error) {
//       const errorMsg = error.response ? error.response.data.error : "Network Error";
//       store.dispatch(authFailure(errorMsg));
//       throw error;
//     }
//   }
// };