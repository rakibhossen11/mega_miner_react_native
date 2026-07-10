import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../redux/store'; // রেডাক্স স্টোর ইমপোর্ট

// অ্যান্ড্রয়েড ইমুলেটর এবং আইওএস/লোকাল আইপির জন্য ডাইনামিক বেস ইউআরএল
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 🔒 Axios Interceptor: প্রতিটা আউটগোয়িং রিকোয়েস্টে রেডাক্স থেকে টোকেনটি অটোমেটিক বসিয়ে দেয়
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token; // রেডাক্স স্টেট থেকে টোকেন রিড
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization হেডার সেটআপ
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;


// import axios from 'axios';
// import { Platform } from 'react-native';
// import { store } from '../redux/store'; // রেডাক্স স্টোর ইমপোর্ট করো

// const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3000/api';

// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // 🔒 রিকোয়েস্ট পাঠানোর ঠিক আগে অটোমেটিক টোকেন ঢুকিয়ে দেওয়ার ম্যাজিক লজিক
// apiClient.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const token = state.auth.token; // রেডাক্স স্টেট থেকে কারেন্ট টোকেন নেওয়া হলো
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // হেডারে টোকেন সেট হলো
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;